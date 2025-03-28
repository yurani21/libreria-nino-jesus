const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;
const SECRET_KEY = "tu_clave_secreta"; 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// Configurar almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Conexión a MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "libreria"
});

db.connect(err => {
    if (err) {
        console.error("Error conectando a MySQL:", err);
    } else {
        console.log("✅ Conectado a MySQL");
    }
});

// Obtener todos los libros
app.get("/api/libros", (req, res) => {
    db.query("SELECT * FROM libros", (err, results) => {
        if (err) {
            console.error("❌ Error al obtener libros:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json(results);
    });
});

// Agregar libro
app.post("/api/libros", upload.single("Lib_Imagen"), (req, res) => {
    const { Lib_Codigo, Lib_Titulo, Lib_Precio, Lib_Editorial, Lib_Categoria } = req.body;
    const Lib_Imagen = req.file ? `/uploads/${req.file.filename}` : null;

    if (!Lib_Codigo || !Lib_Titulo || !Lib_Precio || !Lib_Editorial || !Lib_Categoria) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = "INSERT INTO libros (Lib_Codigo, Lib_Titulo, Lib_Precio, Lib_Editorial, Lib_Categoria, Lib_Imagen) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [Lib_Codigo, Lib_Titulo, Lib_Precio, Lib_Editorial, Lib_Categoria, Lib_Imagen], (err, result) => {
        if (err) {
            console.error("❌ Error al insertar libro:", err);
            return res.status(500).json({ error: "Error al agregar libro" });
        }
        res.json({ message: "✅ Libro agregado correctamente" });
    });
});

// Editar libro
app.put("/api/libros/:id", upload.single("Lib_Imagen"), (req, res) => {
    const { id } = req.params;
    const { Lib_Codigo, Lib_Titulo, Lib_Precio, Lib_Editorial, Lib_Categoria } = req.body;
    let Lib_Imagen = req.file ? `/uploads/${req.file.filename}` : null;

    let sql = "UPDATE libros SET Lib_Codigo=?, Lib_Titulo=?, Lib_Precio=?, Lib_Editorial=?, Lib_Categoria=?";
    let values = [Lib_Codigo, Lib_Titulo, Lib_Precio, Lib_Editorial, Lib_Categoria];

    if (Lib_Imagen) {
        sql += ", Lib_Imagen=?";
        values.push(Lib_Imagen);
    }

    sql += " WHERE Id_Libro=?";
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("❌ Error al actualizar libro:", err);
            return res.status(500).json({ error: "Error al editar libro" });
        }
        res.json({ message: "✅ Libro actualizado correctamente" });
    });
});

// Eliminar libro
app.delete("/api/libros/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM libros WHERE Id_Libro = ?", [id], (err, result) => {
        if (err) {
            console.error("❌ Error al eliminar libro:", err);
            return res.status(500).json({ error: "Error al eliminar libro" });
        }
        res.json({ message: "✅ Libro eliminado correctamente" });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});


