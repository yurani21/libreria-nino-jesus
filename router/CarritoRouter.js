const express = require('express');
const connection = require('../db');
const router = express.Router();

// Ruta para obtener los artículos del carrito
router.get('/:id_carrito', (req, res) => {
    const { id_carrito } = req.params;

    connection.execute(
        'SELECT * FROM articulo_carrito WHERE Id_Carrito = ? LIMIT 0, 25',
        [id_carrito],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al obtener los artículos del carrito');
                return;
            }

            if (results.length > 0) {
                res.json(results); // Retorna los artículos en formato JSON
            } else {
                res.status(404).send('Carrito no encontrado');
            }
        }
    );
});

// Ruta para eliminar un artículo del carrito
router.delete('/carrito/eliminar', (req, res) => {
    const { id_carrito, id_libro } = req.body;

    const query = `DELETE FROM articulo_carrito WHERE Id_Carrito = ? AND Id_Libro = ?`;

    connection.query(query, [id_carrito, id_libro], (err, results) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            return res.status(500).send('Error al eliminar producto');
        }

        res.send('Producto eliminado correctamente');
    });
});





// Ruta para obtener los productos del carrito
router.get('/carrito', (req, res) => {
    const id_usuario = req.query.user_id;  // Asegúrate de que estás recibiendo correctamente el user_id

    connection.query(
        'SELECT * FROM articulo_carrito WHERE Id_Carrito = ?', 
        [id_usuario],  // Pasar el id del carrito a la consulta
        (error, results) => {
            if (error) {
                console.error('Error al obtener el carrito:', error);
                return res.status(500).json({ error: 'Error al obtener el carrito' });
            }
            res.json(results);  // Devuelve los resultados como JSON
        }
    );
});


// Definir rutas más específicas primero
router.get('/carrito/:id_carrito', (req, res) => {
    const { id_carrito } = req.params;

    const query = `
        SELECT 
            p.Id_Libro AS id, 
            p.Lib_Titulo AS name, 
            p.Lib_Precio AS price, 
            p.Lib_Imagen AS image
        FROM articulo_carrito ac
        JOIN libros p ON ac.Id_Libro = p.Id_Libro
        WHERE ac.Id_Carrito = ?
    `;

    connection.query(query, [id_carrito], (err, results) => {
        if (err) {
            console.error('Error en la base de datos:', err);
            return res.status(500).json({ error: 'Error al obtener los productos del carrito' });
        }

        if (results.length > 0) {
            return res.json(results); // Devuelve los productos en formato JSON
        } else {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
    });
});


// Ruta para agregar un producto al carrito
router.post('/carrito/agregar', (req, res) => {
    const { id_usuario, id_libro, cantidad } = req.body;

    // Verificar si el carrito del usuario ya existe
    const queryCarrito = 'SELECT Id_Carrito FROM carrito_compras WHERE Id_Cliente = ?';
    connection.query(queryCarrito, [id_usuario], (err, results) => {
        if (err) {
            console.error('Error al verificar el carrito:', err);
            return res.status(500).json({ error: 'Error al verificar el carrito' });
        }

        let carritoId = results.length > 0 ? results[0].Id_Carrito : null;

        // Si no existe, crear un nuevo carrito
        if (!carritoId) {
            const queryCrearCarrito = 'INSERT INTO carrito_compras (Id_Cliente) VALUES (?)';
            connection.query(queryCrearCarrito, [id_usuario], (err, results) => {
                if (err) {
                    console.error('Error al crear el carrito:', err);
                    return res.status(500).json({ error: 'Error al crear el carrito' });
                }
                carritoId = results.insertId;
                agregarProductoAlCarrito(carritoId);
            });
        } else {
            agregarProductoAlCarrito(carritoId);
        }

        // Función para agregar el producto al carrito
        function agregarProductoAlCarrito(carritoId) {
            const queryAgregar = `
                INSERT INTO articulo_carrito (Id_Carrito, Id_Libro, Art_Carr_Cantidad)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE Art_Carr_Cantidad = Art_Carr_Cantidad + ?;
            `;
            connection.query(queryAgregar, [carritoId, id_libro, cantidad, cantidad], (err, results) => {
                if (err) {
                    console.error('Error al agregar producto al carrito:', err);
                    return res.status(500).json({ error: 'Error al agregar producto al carrito' });
                }
                res.status(200).json({ message: 'Producto agregado correctamente al carrito' });
            });
        }
    });
});






  module.exports = router;
  