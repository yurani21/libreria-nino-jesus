const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Conexión a la base de datos MySQL en XAMPP
const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "", 
  database: "libreria"
});

db.connect(err => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
  } else {
    console.log("Conectado a la base de datos MySQL");
  }
});

// Ruta para obtener todos los productos
app.get("/productos", (req, res) => {
  db.query("SELECT * FROM libros", (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});

// Ruta para agregar un producto
app.post("/productos", (req, res) => {
  const { Lib_Titulo, Lib_Autor, Lib_Precio, Lib_Categoria, Lib_Imagen } = req.body;
  db.query(
    "INSERT INTO libros (Lib_Titulo, Lib_Autor, Lib_Precio, Lib_Categoria, Lib_Imagen) VALUES (?, ?, ?, ?, ?)",
    [Lib_Titulo, Lib_Autor, Lib_Precio, Lib_Categoria, Lib_Imagen],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.json({ message: "Producto agregado correctamente", id: result.insertId });
      }
    }
  );
});

// Ruta para eliminar un producto
app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM libros WHERE Id_Libro = ?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json({ message: "Producto eliminado correctamente" });
    }
  });
});

// Ruta para actualizar un producto
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { Lib_Titulo, Lib_Autor, Lib_Precio, Lib_Categoria, Lib_Imagen } = req.body;
  db.query(
    "UPDATE libros SET Lib_Titulo = ?, Lib_Autor = ?, Lib_Precio = ?, Lib_Categoria = ?, Lib_Imagen = ? WHERE Id_Libro = ?",
    [Lib_Titulo, Lib_Autor, Lib_Precio, Lib_Categoria, Lib_Imagen, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.json({ message: "Producto actualizado correctamente" });
      }
    }
  );
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// -------------------
// CÓDIGO PARA EL PANEL (FRONTEND EN JS)
// -------------------

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
});

function cargarProductos() {
  fetch("http://localhost:3000/productos")
    .then(response => response.json())
    .then(data => {
      const tabla = document.getElementById("tabla-productos");
      tabla.innerHTML = "";
      data.forEach(producto => {
        const fila = `<tr>
          <td>${producto.Id_Libro}</td>
          <td>${producto.Lib_Titulo}</td>
          <td>${producto.Lib_Autor}</td>
          <td>${producto.Lib_Precio}</td>
          <td>${producto.Lib_Categoria}</td>
          <td><img src="${producto.Lib_Imagen}" width="50"></td>
          <td><button onclick="eliminarProducto(${producto.Id_Libro})">Eliminar</button></td>
        </tr>`;
        tabla.innerHTML += fila;
      });
    });
}

function agregarProducto() {
  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const precio = document.getElementById("precio").value;
  const categoria = document.getElementById("categoria").value;
  const imagen = document.getElementById("imagen").value;
  
  fetch("http://localhost:3000/productos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Lib_Titulo: titulo, Lib_Autor: autor, Lib_Precio: precio, Lib_Categoria: categoria, Lib_Imagen: imagen })
  }).then(response => response.json())
    .then(() => cargarProductos());
}

function eliminarProducto(id) {
  fetch(`http://localhost:3000/productos/${id}`, { method: "DELETE" })
    .then(response => response.json())
    .then(() => cargarProductos());
}
