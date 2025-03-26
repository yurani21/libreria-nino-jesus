const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "libreria"
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error("❌ Error al conectar a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a MySQL");
});

// Ruta para agregar libros
app.post("/libros", (req, res) => {
    const { Lib_Titulo, Lib_Precio, Lib_Categoria, Lib_Editorial, Lib_Codigo, Lib_Imagen } = req.body;

    if (!Lib_Titulo || !Lib_Precio || !Lib_Categoria || !Lib_Editorial || !Lib_Codigo || !Lib_Imagen) {
        return res.status(400).json({ message: "⚠️ Todos los campos son obligatorios" });
    }

    const sql = "INSERT INTO libros (Lib_Titulo, Lib_Precio, Lib_Categoria, Lib_Editorial, Lib_Codigo, Lib_Imagen) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [Lib_Titulo, Lib_Precio, Lib_Categoria, Lib_Editorial, Lib_Codigo, Lib_Imagen], (err, result) => {
        if (err) {
            console.error("❌ Error al insertar el libro:", err);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
        res.json({ message: "✅ Libro agregado correctamente" });
    });
});

// Ruta para obtener libros
app.get("/libros", (req, res) => {
    db.query("SELECT * FROM libros", (err, results) => {
        if (err) {
            console.error("❌ Error al obtener libros:", err);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
        res.json(results);
    });
});

// Iniciar el servidor
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

