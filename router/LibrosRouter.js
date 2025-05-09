const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db'); // ✅ uso correcto de pool

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
    const [rows] = await pool.query(`
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
    const [result] = await pool.execute(
      `INSERT INTO libros 
      (Lib_Titulo, Lib_Categoria, Lib_Precio, stock, Lib_Codigo, Lib_Editorial, Lib_Imagen)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [Lib_Titulo, Lib_Categoria, Lib_Precio, stock, Lib_Codigo, Lib_Editorial, Lib_Imagen]
    );
    res.status(201).json({ message: 'Publicación creada correctamente', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear publicación' });
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
      const [old] = await pool.query('SELECT Lib_Imagen FROM libros WHERE Id_Libro = ?', [id]);
      Lib_Imagen = old[0]?.Lib_Imagen;
    }

    await pool.execute(
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
    await pool.execute('DELETE FROM libros WHERE Id_Libro = ?', [id]);
    res.json({ message: 'Libro eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar libro' });
  }
});

// Ruta con paginación
router.get("/api/libros", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
      `SELECT libros.*, categorias.Cat_Nombre 
       FROM libros 
       LEFT JOIN categorias ON libros.Lib_Categoria = categorias.Id_Categoria 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [totalRows] = await pool.query("SELECT COUNT(*) as total FROM libros");
    const totalPages = Math.ceil(totalRows[0].total / limit);

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

// Cambiar estado de publicación
router.patch('/:id/publicar', async (req, res) => {
  const { id } = req.params;
  const { publicado } = req.body;

  try {
    await pool.execute(
      'UPDATE libros SET Lib_Publicado = ? WHERE Id_Libro = ?',
      [publicado ? 1 : 0, id]
    );
    res.json({ message: `Libro ${publicado ? "publicado" : "ocultado"} correctamente.` });
  } catch (err) {
    console.error('Error al actualizar estado de publicación:', err);
    res.status(500).json({ error: 'Error al actualizar publicación' });
  }
});

// Actualizar publicación con PUT
router.put('/:id/publicar', async (req, res) => {
  const { id } = req.params;
  const { publicado } = req.body;

  try {
    await pool.execute(
      `UPDATE libros SET Lib_Publicado = ? WHERE Id_Libro = ?`,
      [publicado, id]
    );
    res.json({ message: 'Estado de publicación actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar estado de publicación' });
  }
});

// Libros publicados filtrados
router.get('/publicados', async (req, res) => {
  const categoria = req.query.categoria?.toLowerCase();
  const categoriaId = {
    libro: 1,
    biblia: 2,
    novena: 3
  }[categoria];

  if (!categoriaId) {
    return res.status(400).json({ error: "Categoría no válida" });
  }

  try {
    const [rows] = await pool.query(`
      SELECT * FROM libros 
      WHERE Lib_Categoria = ? AND Lib_Publicado = 1
    `, [categoriaId]);

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener publicaciones:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Obtener libros publicados con filtro
router.get("/api/libros/publicados", async (req, res) => {
  const categoria = req.query.categoria;
  let query = `
    SELECT libros.*, categorias.Cat_Nombre
    FROM libros
    LEFT JOIN categorias ON libros.Lib_Categoria = categorias.Id_Categoria
    WHERE libros.Lib_Tipo = 'Libro' AND libros.Lib_Publicado = 1
  `;

  if (categoria) {
    query += ` AND categorias.Cat_Nombre = ?`;
  }

  try {
    const [rows] = await pool.query(query, [categoria]);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener libros publicados:", err);
    res.status(500).json({ error: "Error al obtener libros publicados" });
  }
});

// Biblias publicadas
router.get("/api/biblias/publicadas", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT libros.*, categorias.Cat_Nombre
      FROM libros
      LEFT JOIN categorias ON libros.Lib_Categoria = categorias.Id_Categoria
      WHERE libros.Lib_Tipo = 'Biblia' AND libros.Lib_Publicado = 1
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener biblias publicadas:", err);
    res.status(500).json({ error: "Error al obtener biblias publicadas" });
  }
});

// Novenas publicadas
router.get("/api/novenas/publicadas", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT libros.*, categorias.Cat_Nombre
      FROM libros
      LEFT JOIN categorias ON libros.Lib_Categoria = categorias.Id_Categoria
      WHERE libros.Lib_Tipo = 'Novena' AND libros.Lib_Publicado = 1
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener novenas publicadas:", err);
    res.status(500).json({ error: "Error al obtener novenas publicadas" });
  }
});

// Obtener productos
router.get('/api/productos', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM productos');
    res.json(results);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

module.exports = router;
