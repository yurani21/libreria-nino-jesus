const express = require('express');
const cors = require('cors');
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2/promise");
const pool = require("./db.js");
const librosRouter = require('./router/LibrosRouter'); 
const esculturasRouter = require('./router/EsculturasRouter.js');
const MovimientosRouter = require("./router/MovimientosRouter.js");
const AdmiusuariosRouter = require("./router/AdmiusuariosRouter");
const ReportesRouter = require('./router/ReportesRouter');


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
  try {
    const { nombre, apellidos, telefono, correo, password, direccion } = req.body;
    if (!nombre || !apellidos || !telefono || !correo || !password || !direccion) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO administradores (nombre, apellidos, telefono, correo, password, direccion) VALUES (?, ?, ?, ?, ?, ?)";
    pool.query(sql, [nombre, apellidos, telefono, correo, hashedPassword, direccion], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "El correo ya está registrado" });
        return res.status(500).json({ error: "Error al registrar usuario" });
      }
      res.status(200).json({ mensaje: "Usuario registrado exitosamente" });
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Inicio de sesión
app.post('/api/login', (req, res) => {
    const { correo, password } = req.body;

    pool.query('SELECT * FROM administradores WHERE correo = ?', [correo], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error interno del servidor' });

        if (results.length === 0) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                res.status(200).json({ mensaje: 'Inicio de sesión exitoso' });
            } else {
                res.status(401).json({ error: 'Correo o contraseña incorrectos' });
            }
        });
    });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
