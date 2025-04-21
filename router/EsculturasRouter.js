const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db.js');

// Configurar multer
const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Obtener todas las esculturas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM esculturas');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener esculturas' });
  }
});

// Crear escultura
router.post('/', upload.single('Esc_Imagen'), async (req, res) => {
  const { Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, stock } = req.body;
  const Esc_Imagen = req.file ? `/uploads/${req.file.filename}` : null;

  if (!Esc_Codigo || !Esc_Nombre || !Esc_Precio || !Esc_Pulgadas || !stock || !Esc_Imagen) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const [result] = await pool.promise().execute(
      `INSERT INTO esculturas (Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, Esc_Imagen, stock)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, Esc_Imagen, stock]
    );
    res.status(201).json({ message: 'Escultura creada correctamente', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear escultura' });
  }
});

// Actualizar escultura
router.put('/:id', upload.single('Esc_Imagen'), async (req, res) => {
  const { id } = req.params;
  const { Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, stock } = req.body;

  let Esc_Imagen = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    if (!Esc_Imagen) {
      const [old] = await pool.promise().query('SELECT Esc_Imagen FROM esculturas WHERE Id_Escultura = ?', [id]);
      Esc_Imagen = old[0]?.Esc_Imagen;
    }

    await pool.promise().execute(
      `UPDATE esculturas SET 
       Esc_Codigo=?, Esc_Nombre=?, Esc_Precio=?, Esc_Pulgadas=?, Esc_Imagen=?, stock=?
       WHERE Id_Escultura=?`,
      [Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, Esc_Imagen, stock, id]
    );
    res.json({ message: 'Escultura actualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar escultura' });
  }
});

// Eliminar escultura
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.promise().execute('DELETE FROM esculturas WHERE Id_Escultura = ?', [id]);
    res.json({ message: 'Escultura eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar escultura' });
  }
});



module.exports = router;
