// ProductosPubRouter.js
const express = require('express');
const router = express.Router();
const db = require('../db');  // Importar la conexión con promesas

router.get('/publicados', async (req, res) => {
    const categoria = req.query.categoria || null;

    try {
        let query = 'SELECT * FROM productos WHERE publicado = 1';
        let values = [];

        if (categoria) {
            query += ' AND categoria = ?';
            values.push(categoria);
        }

        // Usar la conexión con promesas para ejecutar la consulta
        const [rows] = await db.execute(query, values);  // Usa .execute() con promesas
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos publicados' });
    }
});

router.put('/:id', async (req, res) => {
    const { publicado } = req.body;
    const { id } = req.params;

    try {
        // Usar .execute() para ejecutar la consulta con promesas
        const [result] = await db.execute('UPDATE productos SET publicado = ? WHERE id = ?', [publicado, id]);
        res.json({ mensaje: 'Producto actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

module.exports = router;
