const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../db'); 

// Multer config para logo/marca
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ==================== APARIENCIA ====================
router.post('/apariencia', async (req, res) => {
  const { fondo, texto, boton, fuente } = req.body;
  try {
    await pool.query(
      'REPLACE INTO configuracion_apariencia (id, fondo, texto, boton, fuente) VALUES (1, ?, ?, ?, ?)',
      [fondo, texto, boton, fuente]
    );
    res.json({ mensaje: 'Apariencia guardada con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al guardar apariencia.' });
  }
});

// ==================== TIENDA ====================
router.post('/tienda', async (req, res) => {
  const { bienvenida, banners, fondo, texto } = req.body;
  try {
    await pool.query(
      'REPLACE INTO configuracion_tienda (id, bienvenida, banners, fondo, texto) VALUES (1, ?, ?, ?, ?)',
      [bienvenida, banners, fondo, texto]
    );
    res.json({ mensaje: 'Tienda configurada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al guardar configuración de tienda.' });
  }
});

// ==================== MARCA / LOGO ====================
router.post('/marca', upload.single('logo'), async (req, res) => {
  const { colores } = req.body;
  const logo = req.file?.filename;

  try {
    await pool.query(
      'REPLACE INTO configuracion_marca (id, logo, colores) VALUES (1, ?, ?)',
      [logo, colores]
    );
    res.json({ mensaje: 'Marca/logo actualizados correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al subir el logo.' });
  }
});

// ==================== IDIOMA Y LOCALIZACIÓN ====================
router.post('/idioma', async (req, res) => {
  const { idioma, zona, moneda } = req.body;
  try {
    await pool.query(
      'REPLACE INTO configuracion_idioma (id, idioma, zona, moneda) VALUES (1, ?, ?, ?)',
      [idioma, zona, moneda]
    );
    res.json({ mensaje: 'Idioma y localización guardados con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al guardar idioma.' });
  }
});

// Obtener administrador por ID
router.get('/administradores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM administradores WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: 'Administrador no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al buscar administrador' });
  }
});



// Obtener todos los administradores
router.get('/administradores', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM administradores');
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar administradores:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


  // Actualizar administrador
router.put('/administradores/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, telefono, correo, direccion, password } = req.body;
  
    const campos = ['nombre = ?', 'apellidos = ?', 'telefono = ?', 'correo = ?', 'direccion = ?'];
    const valores = [nombre, apellidos, telefono, correo, direccion];
  
    if (password && password.trim() !== '') {
      campos.push('password = ?');
      valores.push(password); // Idealmente deberías hashearla antes
    }
  
    valores.push(id); // Para el WHERE al final
  
    const sql = `UPDATE administradores SET ${campos.join(', ')} WHERE id = ?`;
  
    pool.query(sql, valores, (error, result) => {
      if (error) {
        console.error('Error al actualizar:', error);
        return res.status(500).json({ mensaje: 'Error al actualizar administrador' });
      }
      res.json({ mensaje: 'Administrador actualizado correctamente' });
    });
  });
  






module.exports = router;
