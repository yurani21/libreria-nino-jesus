// Guardar configuración general
exports.guardarConfiguracion = async (req, res) => {
  try {
    const { tipo, valor } = req.body;

    await db.query('INSERT INTO configuracion (tipo, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor = ?', [tipo, valor, valor]);

    res.status(200).json({ mensaje: 'Configuración guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    res.status(500).json({ error: 'Error al guardar configuración' });
  }
};

// Obtener configuración general
exports.obtenerConfiguracion = async (req, res) => {
    try {
      const [result] = await db.query('SELECT * FROM configuracion');
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      res.status(500).json({ error: 'Error al obtener configuración' });
    }
  };
  