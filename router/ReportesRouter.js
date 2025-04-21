const express = require('express');
const router = express.Router();
const connection = require('../db.js'); 

// Total de productos
router.get('/total-productos', (req, res) => {
  const query = 'SELECT COUNT(*) AS total_productos FROM productos';
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar productos' });
    res.json(results[0]);
  });
});

// Productos más vendidos
router.get('/inventario', (req, res) => {
  const query = `
    SELECT nombre, SUM(cantidad) AS total_vendido
    FROM ventas
    GROUP BY nombre
    ORDER BY total_vendido DESC
    LIMIT 5
  `;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar ventas' });
    res.json(results);
  });
});

// Cantidad de productos por tipo
router.get('/cantidad-productos', (req, res) => {
    const query = `
      SELECT Lib_Tipo AS tipo, COUNT(*) AS cantidad
      FROM libros
      GROUP BY Lib_Tipo
    `;
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener la cantidad por tipo:', err);
        return res.status(500).json({ error: 'Error al obtener datos' });
      }
      res.json(results);
    });
  });
  
  

// Productos más vendidos (alternativa)
// Ruta para obtener los productos más vendidos
router.get('/productos-vendidos', async (req, res) => {
    try {
      // Consulta para obtener los libros más vendidos
      const query = `
        SELECT Lib_Titulo AS nombre, SUM(stock) AS total_vendido
        FROM libros
        GROUP BY Lib_Titulo
        ORDER BY total_vendido DESC
        LIMIT 10
      `;
      connection.query(query, (err, results) => {
        if (err) {
          console.error('Error al consultar los productos vendidos:', err);
          return res.status(500).json({ error: 'Error al obtener los productos vendidos' });
        }
        res.json(results);
      });
    } catch (error) {
      console.error('Error en la ruta productos-vendidos:', error);
      res.status(500).json({ message: 'Error al obtener los productos vendidos', error });
    }
  });
  
// Valor total del inventario
router.get('/valor-inventario', async (req, res) => {
  const query = `
    SELECT SUM(precio * stock) AS valor_total FROM productos
  `;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener valor del inventario' });
    res.json({ valor_total: results[0].valor_total });
  });
});

// GET /resumen-inventario
router.get('/resumen-inventario', (req, res) => {
    const resumen = {};
  
    const sqlTipos = "SELECT Lib_Tipo, COUNT(*) AS cantidad FROM libros GROUP BY Lib_Tipo";
    db.query(sqlTipos, (err, rowsTipos) => {
      if (err) return res.status(500).json({ error: err });
  
      resumen.tipos = {};
      rowsTipos.forEach(row => {
        resumen.tipos[row.Lib_Tipo] = row.cantidad;
      });
  
      const sqlValor = "SELECT SUM(Lib_Precio * stock) AS valorTotal FROM libros";
      db.query(sqlValor, (err2, rowsValor) => {
        if (err2) return res.status(500).json({ error: err2 });
  
        resumen.valorTotal = rowsValor[0].valorTotal || 0;
  
        // Más vendidos (simulado, hasta que tengas tabla de ventas)
        resumen.masVendidos = [
          'Biblia de Estudio Reina Valera',
          'Novena a San Judas',
          'Libro de Oraciones Diarias'
        ];
  
        res.json(resumen);
      });
    });
  });

  // GET /resumen-esculturas
router.get('/resumen-esculturas', (req, res) => {
    const resumen = {};
  
    const sqlTotal = "SELECT COUNT(*) AS total FROM esculturas";
    db.query(sqlTotal, (err, rowsTotal) => {
      if (err) return res.status(500).json({ error: err });
  
      resumen.total = rowsTotal[0].total;
  
      const sqlValor = "SELECT SUM(Esc_Precio * stock) AS valorTotal FROM esculturas";
      db.query(sqlValor, (err2, rowsValor) => {
        if (err2) return res.status(500).json({ error: err2 });
  
        resumen.valorTotal = rowsValor[0].valorTotal || 0;
  
        // Simulación de productos más vendidos
        resumen.masVendidos = [
          'Escultura de San Miguel',
          'Virgen de Guadalupe',
          'Sagrado Corazón de Jesús'
        ];
  
        res.json(resumen);
      });
    });
  });
  


module.exports = router;
