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
const bodyParser = require('body-parser');
const librosRouter = require('./router/LibrosRouter'); 
const esculturasRouter = require('./router/EsculturasRouter.js');
const MovimientosRouter = require("./router/MovimientosRouter.js");
const AdmiusuariosRouter = require("./router/AdmiusuariosRouter");
const ReportesRouter = require('./router/ReportesRouter.js');
const productosRouter = require('./router/ProductosRouter.js');  
const carritoRouter = require('./router/CarritoRouter.js');      



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
// app.use('/api/carrito', carritoRouter);
app.use('/api', carritoRouter);
app.use('/api', ReportesRouter);




// Carpeta de imágenes
const uploadDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadDir));

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

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

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Escultura no encontrada' });
    }

    res.json({ message: 'Escultura actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar escultura:', error);
    res.status(500).json({ error: 'Error al actualizar escultura' });
  }
});

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





// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
