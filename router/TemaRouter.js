const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const pool = require('../db');



// Habilita CORS (esto debe ir antes de definir las rutas)
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });


// Middleware para manejar conexiones
router.use(async (req, res, next) => {
  try {
    req.db = await pool.getConnection();
    req.db.on('error', err => {
      console.error('Error en conexión MySQL:', err);
      pool.releaseConnection(req.db);
    });
    next();
  } catch (err) {
    console.error('Error al conectar a MySQL:', err);
    return res.status(500).json({ error: 'Error de conexión a la base de datos' });
  }
});

// Guardar tema
router.post('/', async (req, res) => {
  const { id_usuario = 1, tema } = req.body;
  
  if (!tema || !['claro', 'oscuro'].includes(tema)) {
    return res.status(400).json({ error: 'Tema debe ser "claro" u "oscuro"' });
  }

  try {
    // Verificar si existe registro
    const [existe] = await req.db.query(
      'SELECT id FROM temas_visuales WHERE id_usuario = ?', 
      [id_usuario]
    );

    if (existe.length > 0) {
      await req.db.query(
        'UPDATE temas_visuales SET tema = ? WHERE id_usuario = ?',
        [tema, id_usuario]
      );
    } else {
      await req.db.query(
        'INSERT INTO temas_visuales (id_usuario, tema) VALUES (?, ?)',
        [id_usuario, tema]
      );
    }

    return res.json({ exito: true, tema });
  } catch (err) {
    console.error('Error al guardar tema:', err);
    return res.status(500).json({ error: 'Error al guardar tema' });
  } finally {
    if (req.db) req.db.release();
  }
});

// Obtener tema
router.get('/:idUsuario', async (req, res) => {
  try {
    const [registro] = await req.db.query(
      'SELECT tema FROM temas_visuales WHERE id_usuario = ?',
      [req.params.idUsuario]
    );

    const tema = registro.length > 0 ? registro[0].tema : 'claro';
    return res.json({ tema });
  } catch (err) {
    console.error('Error al obtener tema:', err);
    return res.json({ tema: 'claro' }); // Valor por defecto si hay error
  } finally {
    if (req.db) req.db.release();
  }
});

//=======================================================
//Configurar la apariencia del inventario
//=======================================================







module.exports = router;