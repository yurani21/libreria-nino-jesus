const express = require('express');
const router = express.Router();
const connection = require('../db.js');

// Total de productos
router.get('/total-productos', async (req, res) => {
  try {
    const [results] = await connection.query('SELECT COUNT(*) AS total_productos FROM productos');
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});

// Productos más vendidos
router.get('/inventario', async (req, res) => {
  try {
    const [results] = await connection.query(`
      SELECT nombre, SUM(cantidad) AS total_vendido
      FROM ventas
      GROUP BY nombre
      ORDER BY total_vendido DESC
      LIMIT 5
    `);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar ventas' });
  }
});

// Cantidad de productos por tipo
router.get('/cantidad-productos', async (req, res) => {
  try {
    const [results] = await connection.query(`
      SELECT Lib_Tipo AS tipo, COUNT(*) AS cantidad
      FROM libros
      GROUP BY Lib_Tipo
    `);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

// Productos más vendidos (alternativa)
router.get('/productos-vendidos', async (req, res) => {
  try {
    const [results] = await connection.query(`
      SELECT Lib_Titulo AS nombre, SUM(stock) AS total_vendido
      FROM libros
      GROUP BY Lib_Titulo
      ORDER BY total_vendido DESC
      LIMIT 10
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos vendidos', error });
  }
});

// Valor total del inventario
router.get('/valor-inventario', async (req, res) => {
  try {
    const [results] = await connection.query('SELECT SUM(precio * stock) AS valor_total FROM productos');
    res.json({ valor_total: results[0].valor_total });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener valor del inventario' });
  }
});

// Resumen inventario
router.get('/resumen-inventario', async (req, res) => {
  try {
    const resumen = {
      tipos: { Libro: 0, Biblia: 0, Novena: 0, Escultura: 0 },  // Asegúrate de agregar 'Escultura'
      valorTotal: 0,
      masVendidos: [],
      esculturasMasVendidas: [] // Agregar un campo para las esculturas más vendidas
    };

    // Obtener la cantidad de libros por tipo
    const [rowsTipos] = await connection.query('SELECT Lib_Tipo, COUNT(*) AS cantidad FROM libros GROUP BY Lib_Tipo');
    rowsTipos.forEach(row => {
      const tipo = row.Lib_Tipo.trim().toLowerCase();
      if (tipo === 'libro') resumen.tipos.Libro = row.cantidad;
      else if (tipo === 'biblia') resumen.tipos.Biblia = row.cantidad;
      else if (tipo === 'novena') resumen.tipos.Novena = row.cantidad;
    });

    // Obtener la cantidad de esculturas (deberías tener una tabla o columna que las distinga)
    const [rowsEsculturas] = await connection.query('SELECT COUNT(*) AS cantidad FROM esculturas');
    resumen.tipos.Escultura = rowsEsculturas[0].cantidad;

    // Obtener el valor total de los libros en inventario
    const [rowsValor] = await connection.query('SELECT SUM(Lib_Precio * stock) AS valorTotal FROM libros');
    resumen.valorTotal = Number(rowsValor[0].valorTotal || 0).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP'
    });

    // Obtener el valor total de las esculturas en inventario
    const [rowsValorEsculturas] = await connection.query('SELECT SUM(Esc_Precio * stock) AS valorTotal FROM esculturas');
    resumen.valorTotalEsculturas = Number(rowsValorEsculturas[0].valorTotal || 0).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP'
    });

    // Obtener las esculturas más vendidas
    const [rowsEsculturasVendidas] = await connection.query(`
      SELECT e.Esc_Nombre AS nombre, SUM(v.cantidad) AS total_vendidas
      FROM ventas v
      JOIN esculturas e ON v.producto_id = e.Id_Escultura
      WHERE v.tipo_producto = 'Escultura'
      GROUP BY e.Esc_Nombre
      ORDER BY total_vendidas DESC
      LIMIT 3
    `);
    resumen.esculturasMasVendidas = rowsEsculturasVendidas.map(r => r.nombre);

    // Enviar todo
    res.json(resumen);

  } catch (err) {
    console.error('Error en resumen-inventario:', err);
    res.status(500).json({ error: 'Error al obtener resumen de inventario' });
  }
});


// Obtener movimientos
router.get('/movimientos', async (req, res) => {
  try {
    const [rows] = await connection.query(`
      SELECT 
        producto_id, 
        tipo_movimiento, 
        cantidad, 
        tipo_producto, 
        fecha, 
        observacion, 
        id_usuario 
      FROM movimientos_inventario 
      ORDER BY fecha DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener movimientos' });
  }
});

// Registrar movimiento
router.post('/movimientos', async (req, res) => {
  const { tipo_producto, tipo_movimiento, cantidad, fecha, observacion, registrado_por } = req.body;

  if (!tipo_producto || !tipo_movimiento || !cantidad || !fecha || !registrado_por) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const [result] = await connection.query(
      'INSERT INTO movimientos_inventario (tipo_producto, tipo_movimiento, cantidad, fecha, observacion, id_usuario) VALUES (?, ?, ?, ?, ?, ?)',
      [tipo_producto, tipo_movimiento, cantidad, fecha, observacion, registrado_por]
    );
    res.status(200).json({ message: 'Movimiento registrado correctamente', id: result.insertId });
  } catch (err) {
    console.error('Error al registrar movimiento:', err); // Aquí estamos logueando el error
    res.status(500).json({ error: 'Error al registrar movimiento' });
  }
});


// Alertas
router.get('/alertas', async (req, res) => {
  const alertas = [];

  try {
    const [libros] = await connection.query('SELECT Lib_Titulo AS nombre, stock FROM libros');

    libros.forEach(libro => {
      if (libro.stock === 0) alertas.push({ tipo: 'agotado', mensaje: `${libro.nombre} - Sin unidades disponibles.` });
      else if (libro.stock < 5) alertas.push({ tipo: 'stock-bajo', mensaje: `${libro.nombre} - Solo quedan ${libro.stock} unidades.` });
      else if (libro.stock > 100) alertas.push({ tipo: 'exceso', mensaje: `${libro.nombre} - ${libro.stock} unidades acumuladas.` });
    });

    const [esculturas] = await connection.query('SELECT Esc_Nombre AS nombre, stock FROM esculturas');

    esculturas.forEach(esc => {
      if (esc.stock === 0) alertas.push({ tipo: 'agotado', mensaje: `${esc.nombre} - Sin unidades disponibles.` });
      else if (esc.stock < 5) alertas.push({ tipo: 'stock-bajo', mensaje: `${esc.nombre} - Solo quedan ${esc.stock} unidades.` });
      else if (esc.stock > 100) alertas.push({ tipo: 'exceso', mensaje: `${esc.nombre} - ${esc.stock} unidades acumuladas.` });
    });

    const [movimientos] = await connection.query(
      `SELECT * FROM movimientos_inventario WHERE tipo_producto NOT IN ('Libro', 'Biblia', 'Escultura', 'Novena')`
    );

    movimientos.forEach(m => {
      alertas.push({
        tipo: 'error-movimiento',
        mensaje: `Movimiento con tipo de producto inválido: ${m.tipo_producto}`
      });
    });

    res.json(alertas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
});

// Ver todas las ventas
router.get('/ventas', async (req, res) => {
  try {
    const [results] = await connection.query(`
      SELECT 
        v.id,
        p.nombre AS producto,
        v.cantidad,
        v.precio,
        v.fecha,
        v.observacion,
        c.Cli_Nombre AS cliente
      FROM ventas v
      JOIN productos p ON v.producto_id = p.id
      JOIN clientes c ON v.cliente_id = c.Id_Cliente
      ORDER BY v.fecha DESC
    `);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar ventas' });
  }
});


// POST /ventas - Registrar una nueva venta
router.post('/ventas', (req, res) => {
  const { producto_id, cliente_id, cantidad, precio, observacion, tipo_producto } = req.body;

  // Validación de datos
  if (!producto_id || !cliente_id || !cantidad || !precio || !tipo_producto) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const fecha = new Date();

  const query = `
    INSERT INTO ventas (producto_id, cliente_id, cantidad, precio, fecha, observacion, tipo_producto)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [producto_id, cliente_id, cantidad, precio, fecha, observacion, tipo_producto],
    (err, result) => {
      if (err) {
        console.error('Error al registrar la venta:', err);
        return res.status(500).json({ error: 'Error al guardar la venta' });
      }

      res.status(201).json({
        mensaje: 'Venta registrada exitosamente',
        id: result.insertId
      });
    }
  );
});


// Resumen de esculturas
router.get('/resumen-esculturas', async (req, res) => {
  try {
    const resumen = {
      total: 0,
      valorTotal: 0,
      masVendidos: []
    };

    // Obtener el total de esculturas
    const [rowsTotal] = await connection.query('SELECT COUNT(*) AS total FROM esculturas');
    resumen.total = rowsTotal[0].total;

    // Valor total de esculturas (precio * stock)
    const [rowsValor] = await connection.query('SELECT SUM(Esc_Precio * stock) AS valorTotal FROM esculturas');
    resumen.valorTotal = Number(rowsValor[0].valorTotal || 0);

    // Esculturas más vendidas
    const [vendidas] = await connection.query(`
      SELECT e.Esc_Nombre AS nombre, SUM(v.cantidad) AS total_vendidos
      FROM ventas v
      JOIN esculturas e ON v.producto_id = e.Id_Escultura
      WHERE v.tipo_producto = 'Escultura'
      GROUP BY e.Esc_Nombre
      ORDER BY total_vendidos DESC
      LIMIT 3
    `);
    resumen.masVendidos = vendidas.map(row => row.nombre);

    res.json(resumen);
  } catch (error) {
    console.error('Error al generar resumen de esculturas:', error);
    res.status(500).json({ error: 'Error al obtener resumen de esculturas' });
  }
});




module.exports = router;
