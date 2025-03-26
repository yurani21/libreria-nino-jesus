const mysql = require("mysql2");

// Configurar la conexión a MySQL en XAMPP
const db = mysql.createConnection({
  host: "localhost",
  user: "root",      
  password: "",      
  database: "libreria"
});

// Conectar a MySQL
db.connect(err => {
  if (err) {
    console.error(" Error al conectar a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL");
  
  // Consultar la tabla "libros"
  db.query("SELECT * FROM libros", (err, results) => {
    if (err) {
      console.error(" Error en la consulta:", err);
      return;
    }
    
    // Mostrar los resultados en la terminal
    console.log("Libros disponibles:");
    console.table(results);
    
    // Cerrar la conexión
    db.end();
  });
});
