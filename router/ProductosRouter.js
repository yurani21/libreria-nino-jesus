// /backend/productosRouter.js

const express = require('express');
const pool = require('../db');  // Importa la conexión a la base de datos
const router = express.Router();

// Ruta para obtener todos los productos
router.get('/productos', async (req, res) => {
    try {
        const [productos] = await pool.execute('SELECT * FROM productos');
        res.json(productos);  // Devuelve los productos en formato JSON
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

module.exports = router;
