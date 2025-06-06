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

/* ---------- RUTAS PRINCIPALES ---------- */

// Obtener todas las esculturas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM esculturas');
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
router.put('/api/esculturas/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, stock } = req.body;

    if (!Esc_Codigo || !Esc_Nombre || !Esc_Precio || !Esc_Pulgadas || !stock) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const [result] = await pool.query(
      'UPDATE esculturas SET Esc_Codigo = ?, Esc_Nombre = ?, Esc_Precio = ?, Esc_Pulgadas = ?, stock = ? WHERE Id_Escultura = ?',
      [Esc_Codigo, Esc_Nombre, Esc_Precio, Esc_Pulgadas, stock, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Escultura no encontrada' });
    }

    res.json({ message: 'Escultura actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar escultura:', error);
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

// Publicar escultura
router.put("/publicar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE esculturas SET publicado = TRUE WHERE Id_Escultura = ?", [id]);
    const [result] = await pool.query("SELECT * FROM esculturas WHERE Id_Escultura = ?", [id]);
    if (result.length === 0) return res.status(404).json({ error: "Escultura no encontrada" });

    res.json({ message: "Escultura publicada correctamente", escultura: result[0] });
  } catch (err) {
    console.error("Error al publicar escultura:", err.message);
    res.status(500).json({ error: "Error al publicar la escultura" });
  }
});

// Alternar estado de publicación
router.put('/publicar-ocultar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [current] = await pool.query('SELECT publicado FROM esculturas WHERE Id_Escultura = ?', [id]);
    if (current.length === 0) return res.status(404).json({ error: 'Escultura no encontrada' });

    const nuevoEstado = !current[0].publicado;
    await pool.query('UPDATE esculturas SET publicado = ? WHERE Id_Escultura = ?', [nuevoEstado, id]);

    res.json({ message: `Escultura ${nuevoEstado ? 'publicada' : 'ocultada'} correctamente.` });
  } catch (err) {
    console.error('Error al alternar publicación:', err);
    res.status(500).json({ error: 'Error al actualizar estado de publicación' });
  }
});

// Esculturas publicadas
<<<<<<< HEAD
router.get("/esculturas/catalogo", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM esculturas WHERE publicado = TRUE");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener esculturas publicadas:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

=======
router.get('/catalogo', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM esculturas WHERE publicado = 1');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener esculturas publicadas:', err);
    res.status(500).json({ error: 'Error al obtener esculturas publicadas' });
  }
});


>>>>>>> c80883a (Codigo Act)
// Ruta de prueba de conexión a la base de datos
router.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
    res.json({ ok: true, resultado: rows[0].resultado });
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err);
    res.status(500).json({ ok: false, error: 'Error de conexión con la base de datos' });
  }
});

module.exports = router;
