const express = require('express');
const cors = require('cors');
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path"); 
const fs = require("fs");
const router = express.Router();
const mysql = require("mysql2/promise");
const { Parser } = require('json2csv');
const pool = require('./db.js');
<<<<<<< HEAD
=======
const jwt = require('jsonwebtoken');
const secret = 'secreto_super_seguro'; 
>>>>>>> c80883a (Codigo Act)
const bodyParser = require('body-parser');
const librosRouter = require('./router/LibrosRouter'); 
const esculturasRouter = require('./router/EsculturasRouter.js');
const MovimientosRouter = require("./router/MovimientosRouter.js");
const AdmiusuariosRouter = require("./router/AdmiusuariosRouter");
const ReportesRouter = require('./router/ReportesRouter.js');
const productosRouter = require('./router/ProductosRouter.js');  
<<<<<<< HEAD
const carritoRouter = require('./router/CarritoRouter.js');      

=======
const carritoRouter = require('./router/CarritoRouter.js');  
const backupsRoute = require('./router/backups.js');  
const TemaRouter = require('./router/TemaRouter.js');
const personalizacionRouter = require('./router/personalizacionRouter.js');
>>>>>>> c80883a (Codigo Act)


const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/libros", librosRouter);
app.use('/api/esculturas', esculturasRouter);
app.use("/api/movimientos", MovimientosRouter);
app.use("/api/administradores", AdmiusuariosRouter);
app.use("/api/reportes", ReportesRouter);
app.use('/api/productos', require('./router/ProductosPubRouter.js'));
<<<<<<< HEAD
// app.use('/api/carrito', carritoRouter);
app.use('/api', carritoRouter);
app.use('/api', ReportesRouter);
=======
app.use('/api', carritoRouter);
app.use('/api', ReportesRouter);
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/api/backups', backupsRoute);
app.use('/api/tema', TemaRouter);
app.use('/api/tema', require('./router/TemaRouter.js'));
app.use('/api/personalizacion', personalizacionRouter);
>>>>>>> c80883a (Codigo Act)




app.use('/uploads', express.static('uploads'));

// Carpeta de imágenes
const uploadDir = path.join(__dirname, "uploads");
app.use('/uploads', cors(), express.static(uploadDir));



// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


/*_____________________________________SECCIÓN ADMINISTRADORES____________________________________________________*/
// Registro de administradores
app.post("/register", async (req, res) => {
  const { nombre, apellidos, telefono, correo, password, direccion } = req.body;

  if (!nombre || !apellidos || !telefono || !correo || !password || !direccion) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(`
      INSERT INTO administradores (nombre, apellidos, telefono, correo, password, direccion)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [nombre, apellidos, telefono, correo, hashedPassword, direccion]);

    res.status(200).json({ mensaje: "Usuario registrado exitosamente" });

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    console.error("Error al registrar administrador:", error);
    res.status(500).json({ error: "Error en el servidor al registrar" });
  }
});

<<<<<<< HEAD

// Ruta para inicio de sesión
app.post('/api/login', async (req, res) => {
  const { correo, password } = req.body;
  console.log('Correo recibido:', correo);

  try {
    const [results] = await pool.query('SELECT * FROM administradores WHERE correo = ?', [correo]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const user = results[0];
    const esValida = await bcrypt.compare(password, user.password);

    if (!esValida) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    res.status(200).json({ mensaje: 'Bienvenido al Panel Administrativo' });
  } catch (err) {
    console.error('Error en login:', err);
=======
//ver todos los administradores
app.get('/admin/listar', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, apellidos, telefono, correo, direccion FROM administradores');
    res.json(rows);
  } catch (error) {
    console.error('Error al listar administradores:', error);
>>>>>>> c80883a (Codigo Act)
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

<<<<<<< HEAD
=======
//Cambiar rol para un administrador
app.put('/admin/:id/rol', (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;
  const rolesValidos = ['superadmin', 'inventarista', 'ventas', 'auditor'];

  if (!rolesValidos.includes(rol)) {
    return res.status(400).json({ error: 'Rol no válido' });
  }

  pool.query('UPDATE administradores SET rol = ? WHERE id = ?', [rol, id], (error) => {
    if (error) return res.status(500).json({ error });
    res.json({ mensaje: 'Rol actualizado' });
  });
});

//Desactivar o eliminar a un administrador
app.put('/admin/:id/desactivar', (req, res) => {
  const { id } = req.params;
  pool.query('UPDATE administradores SET activo = FALSE WHERE id = ?', [id], (error) => {
    if (error) return res.status(500).json({ error });
    res.json({ mensaje: 'Administrador desactivado' });
  });
});

//Activar a un administrador
app.put('/admin/:id/activar', (req, res) => {
  const { id } = req.params;
  pool.query('UPDATE administradores SET activo = TRUE WHERE id = ?', [id], (error) => {
    if (error) return res.status(500).json({ error });
    res.json({ mensaje: 'Administrador activado' });
  });
});

//Eliminación permanente "Activo"
app.delete('/admin/eliminar/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM administradores WHERE id = ?', [id]);
    res.json({ mensaje: 'Administrador eliminado' });
  } catch (error) {
    console.error('Error al eliminar administrador:', error);
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

//Protección por roles}
function verificarRol(rolRquerido) {
  return(req, res, next) => {
    const usuario = req.usuario;
    if(usuario && usuario.rol === rolRequerido){
      next();
    } else{
      res.status(403).json({ error:'No tienes permiso suficientes' });
    }
  };
}

//Obtener y Actualizar un administrador
app.get('/admin/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM administradores WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener administrador' });
  }
});

//Editar un Administrador
app.put('/admin/editar/:id', async (req, res) => {
  const id = req.params.id;
  const { nombre, apellidos, telefono, correo, direccion } = req.body;

  try {
    await pool.query(
      'UPDATE administradores SET nombre = ?, apellidos = ?, telefono = ?, correo = ?, direccion = ? WHERE id = ?',
      [nombre, apellidos, telefono, correo, direccion, id]
    );
    res.json({ mensaje: 'Administrador actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar administrador' });
  }
});

// Ruta para obtener todos los administradores
app.get('/administradores', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM administradores');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener administradores:', error);
    res.status(500).json({ error: 'Error al obtener administradores' });
  }
});

/*______________________________INICIO DE SESIÓN DEL LOGIN___________________________________________________*/

// Ruta para inicio de sesión
app.post('/api/login', async (req, res) => {
  const { correo, password } = req.body;
  console.log('Correo recibido:', correo);

  try {
    const [results] = await pool.query('SELECT * FROM administradores WHERE correo = ?', [correo]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const user = results[0];
    const esValida = await bcrypt.compare(password, user.password);

    if (!esValida) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    res.status(200).json({ mensaje: 'Bienvenido al Panel Administrativo' });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

>>>>>>> c80883a (Codigo Act)
// Ruta de ventas
app.get('/ventas', (req, res) => {
  res.json([
    { id: 1, producto: 'Libro', cantidad: 2, precio: 20, cliente: 'Juan', fecha: '2023-04-21', observacion: '' },
    { id: 2, producto: 'Biblia', cantidad: 1, precio: 30, cliente: 'Maria', fecha: '2023-04-22', observacion: 'Urgente' },
  ]);
});

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json(rows); 
  } catch (error) {
    res.status(500).json({ error: 'No se pudo conectar a la base de datos' });
  }
});

<<<<<<< HEAD
=======
/*_____________________________SECCIÓN DE LIBROS___________________________________________________*/
>>>>>>> c80883a (Codigo Act)
//ruta para obtener libros
app.get('/api/libros', async (req, res) => {
  try {
    const libros = await db.query("SELECT * FROM libros"); // Ejemplo
    res.json(libros); // Asegúrate de que sea un array
  } catch (error) {
    console.error("Error al obtener libros:", error);
    res.status(500).json({ error: "Error al obtener libros" });
  }
});

<<<<<<< HEAD

=======
/*______________________SECCIÓN PARA PUBLICAR BIBLIAS____________________________________*/
>>>>>>> c80883a (Codigo Act)
//ruta para publicar catalogo de biblias
app.get("/api/biblias/publicadas", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM libros WHERE Lib_Publicado = 1 AND Lib_Categoria = 2");
    res.json(result);
  } catch (error) {
    console.error("Error al obtener biblias:", error);
    res.status(500).json({ error: "Error al obtener biblias" });
  }
});

<<<<<<< HEAD
=======
/*______________________SECCIÓN PARA PUBLICAR NOVENAS____________________________________*/
>>>>>>> c80883a (Codigo Act)
//ruta para catalogo de novenas
app.get("/api/novenas/publicadas", async (req, res) => {
  try {
   const [result] = await pool.query("SELECT * FROM libros WHERE Lib_Publicado = 1 AND Lib_Categoria = 3"); 
    res.json(result);
  } catch (error) {
    console.error("Error al obtener novenas:", error.message);
    res.status(500).json({ error: "Error al obtener novenas" });
  }
});

<<<<<<< HEAD

// Ruta PUT para actualizar una escultura
router.put('/api/esculturas/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, stock } = req.body;

    if (!Esc_Codigo || !Esc_Nombre || !Esc_Precio || !Esc_Pulgadas || !stock) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const [result] = await pool.query(
      'UPDATE esculturas SET Esc_Codigo = ?, Esc_Nombre = ?, Esc_Precio = ?, Esc_Pulgadas = ?, stock = ? WHERE Id_Escultura = ?',
      [Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, stock, id]
    );
=======
/*_______________________________SECCIÓN PARA ACTUALIZAR ESCULTURAS________________________________________________*/
// Ruta PUT para actualizar una escultura
app.put('/api/esculturas/:id', upload.single('Esc_Imagen'), async (req, res) => {
  try {
    const id = req.params.id;
    const { Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, stock } = req.body;
    const Esc_Imagen = req.file ? `/uploads/${req.file.filename}` : null;

    if (!Esc_Codigo || !Esc_Nombre || !Esc_Precio || !Esc_Pulgadas || !stock) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Construye la consulta SQL según si hay imagen nueva o no
    let query = `UPDATE esculturas SET Esc_Codigo = ?, Esc_Nombre = ?, Esc_Precio = ?, Esc_Pulgadas = ?, stock = ?`;
    const params = [Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, stock];

    if (Esc_Imagen) {
      query += `, Esc_Imagen = ?`;
      params.push(Esc_Imagen);
    }

    query += ` WHERE Id_Escultura = ?`;
    params.push(id);

    const [result] = await pool.query(query, params);
>>>>>>> c80883a (Codigo Act)

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Escultura no encontrada' });
    }

<<<<<<< HEAD
    res.json({ message: 'Escultura actualizada correctamente' });
=======
    res.status(200).json({ message: 'Escultura actualizada exitosamente' });
>>>>>>> c80883a (Codigo Act)
  } catch (error) {
    console.error('Error al actualizar escultura:', error);
    res.status(500).json({ error: 'Error al actualizar escultura' });
  }
});

<<<<<<< HEAD
app.post('/api/esculturas', upload.single('Esc_Imagen'), async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);
    console.log('Imagen recibida:', req.file);
    
    // Aquí puede ir la lógica para insertar en la base de datos
    
    res.status(200).json({ message: 'Escultura guardada con éxito' });
  } catch (error) {
    console.error('Error al guardar escultura:', error);
    res.status(500).json({ message: 'Error interno al guardar la escultura' });
  }
});

// Endpoint para guardar una escultura (crear o actualizar)
app.post('/api/esculturas/guardar', upload.single('Esc_Imagen'), (req, res) => {
  // Obtener los datos del formulario
  const { Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, stock, Id_Escultura } = req.body;
  const imagen = req.file ? req.file.filename : null;
  if (Id_Escultura) {
    // Lógica de actualización
  } else {
    // Lógica de creación
  }

  
  res.json({ message: 'Escultura guardada con éxito' });
});

=======




/*____________________________________________GUARDAR UNA ESCULTURA____________________________________________*/
// Endpoint para guardar una escultura (crear o actualizar)
app.post('/api/esculturas', upload.single('Esc_Imagen'), async (req, res) => {
  try {
    // Obtener los datos del formulario
    const { Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, stock } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    // Validar que todos los campos obligatorios estén presentes
    if (!Esc_Codigo || !Esc_Nombre || !Esc_Precio || !Esc_Pulgadas || !stock || !imagen) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios, incluyendo la imagen.' });
    }

    // Insertar en la base de datos
    const query = `
      INSERT INTO esculturas (Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, Esc_Imagen, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, imagen, stock]);

    // Verificar si la escultura fue insertada correctamente
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Escultura guardada con éxito' });
    } else {
      res.status(500).json({ error: 'No se pudo guardar la escultura' });
    }

  } catch (error) {
    console.error('Error al guardar escultura:', error);
    res.status(500).json({ error: 'Error al crear escultura' });
  }
});


// Ruta para tu HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'reportes.html'));
});

// Ruta para obtener el total de productos
app.get('/total-productos', (req, res) => {
  pool.query('SELECT COUNT(*) AS total FROM productos', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }
    res.json({ total: results[0].total });
  });
});


// Ruta para obtener los productos más vendidos
app.get('/productos-mas-vendidos', (req, res) => {
  pool.query('SELECT producto, COUNT(*) AS ventas FROM ventas GROUP BY producto ORDER BY ventas DESC LIMIT 5', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }
    res.json(results);  // Enviar los productos más vendidos
  });
});

/*________________________OBTENER RESUMEN-INVENTARIO_______________________________________________________________*/
// Endpoint para obtener el resumen de inventario
app.get('/api/resumen-inventario', async (req, res) => {
  try {
      // Consultar los libros, biblias y novenas más vendidos
      const [libros] = await pool.query(`
          SELECT nombre, SUM(cantidad) AS cantidad
          FROM ventas
          WHERE tipo IN ('Libro', 'Biblia', 'Novena')
          GROUP BY nombre
          ORDER BY cantidad DESC
          LIMIT 5
      `);
      console.log('Libros y productos más vendidos:', libros);

      // Consultar las esculturas más vendidas
      const [esculturas] = await pool.query(`
          SELECT nombre, SUM(cantidad) AS cantidad
          FROM ventas
          WHERE tipo = 'Escultura'
          GROUP BY nombre
          ORDER BY cantidad DESC
          LIMIT 5
      `);
      console.log('Esculturas más vendidas:', esculturas);

      // Devolver los resultados en formato JSON
      res.json({
          masVendidos: libros,
          esculturasVendidas: esculturas
      });
  } catch (err) {
      console.error('Error al obtener el resumen de inventario:', err);
      res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

/*_________________SECCIÓN DE CONFIGURACIÓN(SEGURIDAD Y CONTRASEÑAS)__________________________________________*/

app.get('/api/configuracion/seguridad', (req, res) => {
  res.json(politicaSeguridad);
});


// Actualizar política de seguridad
let politicaSeguridad = {};  // Definir globalmente si necesitas persistir la configuración

app.post('/api/configuracion/seguridad', (req, res) => {
  const { longitud_minima, requiere_especial, requiere_mayusculas } = req.body;

  if (!longitud_minima || longitud_minima < 6) {
      return res.status(400).json({ error: 'Longitud mínima no válida' });
  }

  politicaSeguridad = {
      longitud_minima: Number(longitud_minima),
      requiere_especial: Boolean(requiere_especial),
      requiere_mayusculas: Boolean(requiere_mayusculas)
  };

  res.status(200).json(politicaSeguridad);  // Devolver la nueva configuración
});

//respaldos

app.get('/api/respaldar-db', (req, res) => {
  // Código para generar y enviar el respaldo
  const respaldo = fs.readFileSync('ruta/del/respaldo.sql');
  res.setHeader('Content-Disposition', 'attachment; filename=respaldobd.sql');
  res.send(respaldo);
});

// Endpoint para guardar logo y marca
app.post('/api/personalizacion/marca', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 }
]), (req, res) => {
  const data = req.body;
  const logo = req.files.logo?.[0]?.filename;
  const favicon = req.files.favicon?.[0]?.filename;

  console.log("Configuración de marca:", data);
  console.log("Archivos subidos:", logo, favicon);

  // Guardar en base de datos y mover los archivos si es necesario

  res.json({ success: true, mensaje: 'Marca y logo actualizados.' });
});

app.post('/api/personalizacion/apariencia', (req, res) => {
  const data = req.body;
  console.log('Configuración de apariencia:', data);

  // Aquí se puede guardar en una tabla: config_apariencia

  res.json({ success: true, mensaje: 'Preferencias de visualización guardadas.' });
});


app.post('/api/personalizacion/tienda', (req, res) => {
  const config = req.body;
  console.log("Configuración de la tienda online:", config);

  // Puedes guardar la configuración en una tabla: tienda_config
  res.json({ success: true, mensaje: 'Tienda online actualizada correctamente.' });
});

app.post('/api/personalizacion/idioma', (req, res) => {
  const configuracion = req.body;
  console.log("Configuración de idioma y localización:", configuracion);

  // Aquí puedes guardar los datos en una tabla: config_localizacion

  res.json({ success: true, mensaje: 'Configuración guardada correctamente.' });
});


// Endpoint para obtener configuración tienda
app.get('/api/personalizacion/tienda', (req, res) => {
  // Aquí obtienes datos reales o un ejemplo
  res.json({
    bienvenida: "Bienvenido a mi tienda",
    banners: "si",
    fondo: "#f0f0f0",
    texto: "#333333"
  });
});





>>>>>>> c80883a (Codigo Act)




// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
