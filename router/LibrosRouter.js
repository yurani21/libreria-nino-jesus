const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db');

// Configurar multer
const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(`
      SELECT libros.*, categorias.Cat_Nombre 
      FROM libros 
      LEFT JOIN categorias ON libros.Lib_Categoria = categorias.Id_Categoria
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libros' });
  }
});

// Crear libro
router.post('/', upload.single('Lib_Imagen'), async (req, res) => {
  const {
    Lib_Titulo,
    Lib_Categoria,
    Lib_Precio,
    Lib_Codigo,
    Lib_Editorial,
    stock 
  } = req.body;

  const Lib_Imagen = req.file ? `/uploads/${req.file.filename}` : null;

  if (!Lib_Titulo || !Lib_Categoria || !Lib_Precio || !stock || !Lib_Codigo || !Lib_Editorial || !Lib_Imagen) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios, incluida imagen' });
  }

  try {
    const [result] = await pool.promise().execute(
      `INSERT INTO libros 
      (Lib_Titulo, Lib_Categoria, Lib_Precio, stock, Lib_Codigo, Lib_Editorial, Lib_Imagen)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [Lib_Titulo, Lib_Categoria, Lib_Precio, stock, Lib_Codigo, Lib_Editorial, Lib_Imagen]
    );
    res.status(201).json({ message: 'Libro creado correctamente', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear libro' });
  }
});

// Editar libro
router.put('/:id', upload.single('Lib_Imagen'), async (req, res) => {
  const { id } = req.params;
  const {
    Lib_Titulo,
    Lib_Categoria,
    Lib_Precio,
    Lib_Codigo,
    Lib_Editorial,
    stock 
  } = req.body;

  let Lib_Imagen = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    if (!Lib_Imagen) {
      const [old] = await pool.promise().query('SELECT Lib_Imagen FROM libros WHERE Id_Libro = ?', [id]);
      Lib_Imagen = old[0]?.Lib_Imagen;
    }

    await pool.promise().execute(
      `UPDATE libros SET 
      Lib_Titulo=?, Lib_Categoria=?, Lib_Precio=?, stock=?, 
      Lib_Codigo=?, Lib_Editorial=?, Lib_Imagen=?
      WHERE Id_Libro=?`,
      [Lib_Titulo, Lib_Categoria, Lib_Precio, stock, Lib_Codigo, Lib_Editorial, Lib_Imagen, id]
    );
    res.json({ message: 'Libro actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar libro' });
  }
});

// Eliminar libro
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.promise().execute('DELETE FROM libros WHERE Id_Libro = ?', [id]);
    res.json({ message: 'Libro eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar libro' });
  }
});


router.get("/api/libros", async (req, res) => {
  try {
    // Obtener los parámetros de página y límite (si no se envían, usamos valores por defecto)
    const page = parseInt(req.query.page) || 1; // Página actual, por defecto es 1
    const limit = parseInt(req.query.limit) || 20; // Resultados por página, por defecto es 20
    const offset = (page - 1) * limit; // Desplazamiento para la paginación

    // Consulta SQL para obtener los libros con paginación
    const [rows] = await pool.promise().query(
      `SELECT libros.*, categorias.Cat_Nombre 
       FROM libros 
       LEFT JOIN categorias ON libros.Lib_Categoria = categorias.Id_Categoria 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    // Obtener el total de registros para calcular el número total de páginas
    const [totalRows] = await pool.promise().query("SELECT COUNT(*) as total FROM libros");

    // Calcular el número total de páginas
    const totalPages = Math.ceil(totalRows[0].total / limit);

    // Enviar los datos junto con la información de la paginación
    res.json({
      data: rows,
      page,
      totalPages,
      totalItems: totalRows[0].total,
    });
  } catch (err) {
    console.error("Error al obtener libros:", err);
    res.status(500).json({ error: "Error al obtener libros" });
  }
});


module.exports = router;
