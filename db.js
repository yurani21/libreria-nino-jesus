const mysql = require("mysql2");

// Configuración de conexión XAMPP/MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "libreria"
});

// Conexión
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conectado a la base de datos MySQL");
  }
});

module.exports = connection;




