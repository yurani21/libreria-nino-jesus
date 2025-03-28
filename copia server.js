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
        console.log(" Conectado a MySQL");
    }
});

// Obtener todos los libros
app.get("/api/libros", (req, res) => {
    db.query("SELECT * FROM libros", (err, results) => {
        if (err) {
            console.error(" Error al obtener libros:", err);
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
            console.error("Error al insertar libro:", err);
            return res.status(500).json({ error: "Error al agregar libro" });
        }
        res.json({ message: "Libro agregado correctamente" });
    });
});

// Editar libro
app.put("/api/libros/:id", upload.single("Lib_Imagen"), async (req, res) => {
    const { id } = req.params;
    const { Lib_Codigo, Lib_Titulo, Lib_Precio, Lib_Editorial, Lib_Categoria } = req.body;
    let imagen = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        let query = "UPDATE libros SET Lib_Codigo=?, Lib_Titulo=?, Lib_Precio=?, Lib_Editorial=?, Lib_Categoria=?";
        let values = [Lib_Codigo, Lib_Titulo, Lib_Precio, Lib_Editorial, Lib_Categoria];

        if (imagen) {
            query += ", Lib_Imagen=?";
            values.push(imagen);
        }

        query += " WHERE Id_Libro=?";
        values.push(id);

        const [result] = await connection.execute(query, values);
        res.json({ message: "Libro actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar libro:", error);
        res.status(500).json({ message: "Error al actualizar el libro" });
    }
});


// Eliminar libro
app.delete("/api/libros/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM libros WHERE Id_Libro = ?", [id], (err, result) => {
        if (err) {
            console.error(" Error al eliminar libro:", err);
            return res.status(500).json({ error: "Error al eliminar libro" });
        }
        res.json({ message: "Libro eliminado correctamente" });
    });
});

// **Registro de usuarios**
app.post("/register", async (req, res) => {
    try {
        const { nombre, apellidos, telefono, correo, password, direccion } = req.body;

        if (!nombre || !apellidos || !telefono || !correo || !password || !direccion) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar usuario en la base de datos
        const sql = "INSERT INTO administradores (nombre, apellidos, telefono, correo, password, direccion) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [nombre, apellidos, telefono, correo, hashedPassword, direccion], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: "El correo ya está registrado" });
                }
                return res.status(500).json({ error: "Error al registrar usuario" });
            }
            res.status(200).json({ mensaje: "Usuario registrado exitosamente" });
        });

    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// **Inicio de sesión**
app.post("/register", async (req, res) => {
    const { nombre, apellidos, telefono, correo, password, direccion } = req.body;

    try {
        // 1️⃣ Verifica si el correo ya está en uso
        const verificarCorreo = "SELECT * FROM administradores WHERE correo = ?";
        db.query(verificarCorreo, [correo], async (err, results) => {
            if (err) {
                console.error("Error en la consulta:", err);
                return res.status(500).json({ error: "Error en el servidor" });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: "El correo ya está registrado" });
            }

            // 2️⃣ Si el correo no existe, encripta la contraseña y registra al usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = "INSERT INTO administradores (nombre, apellidos, telefono, correo, password, direccion) VALUES (?, ?, ?, ?, ?, ?)";

            db.query(sql, [nombre, apellidos, telefono, correo, hashedPassword, direccion], (err, result) => {
                if (err) {
                    console.error("Error al registrar usuario:", err);
                    return res.status(500).json({ error: "Error al registrar usuario" });
                }
                res.status(200).json({ mensaje: "Usuario registrado exitosamente" });
            });
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

app.post("/login", (req, res) => {
    const { correo, password } = req.body;

    const sql = "SELECT * FROM administradores WHERE correo = ?";
    db.query(sql, [correo], (err, result) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }

        if (result.length === 0) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }

        const usuario = result[0];

        bcrypt.compare(password, usuario.password, (err, isMatch) => {
            if (err) {
                console.error("Error en bcrypt.compare:", err);
                return res.status(500).json({ error: "Error en el servidor" });
            }

            if (isMatch) {
                return res.status(200).json({ message: "Inicio de sesión exitoso" });
            } else {
                return res.status(401).json({ error: "Correo o contraseña incorrectos" });
            }
        });
    });
});


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

