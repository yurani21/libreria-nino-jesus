const express = require('express');
const router = express.Router();
const pool = require('../db'); 
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Crear carpeta de backups si no existe
const backupDir = path.join(__dirname, '../backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

// Ruta para crear respaldo
router.get('/crear', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [libros] = await connection.query('SELECT * FROM libros');
    const [ventas] = await connection.query('SELECT * FROM ventas');
    connection.release();

    const date = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonPath = path.join(backupDir, `respaldo-${date}.json`);
    const zipPath = path.join(backupDir, `respaldo-${date}.zip`);

    // Guardar datos en JSON
    const data = { libros, ventas };
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    // Comprimir en ZIP
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip');

    output.on('close', () => {
      fs.unlinkSync(jsonPath); // Borra JSON después de comprimir
      res.download(zipPath);   // Enviar ZIP como descarga
    });

    archive.on('error', err => { throw err; });

    archive.pipe(output);
    archive.file(jsonPath, { name: `respaldo-${date}.json` });
    archive.finalize();

  } catch (err) {
    console.error('Error al generar respaldo:', err);
    res.status(500).json({ error: 'No se pudo crear el respaldo' });
  }
});

module.exports = router;
