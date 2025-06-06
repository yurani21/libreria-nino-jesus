// auth/middleware.js
function authMiddleware(req, res, next) {
    // Simula verificación
    console.log('Middleware ejecutado');
    next(); // Continua al siguiente middleware o ruta
  }
  
  
  module.exports = authMiddleware;

  // auth/middleware.js

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu_clave_secreta'; // Usa una variable de entorno real en producción

function verificarToken(req, res, next) {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.id; // o como estés guardando el ID del usuario
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
}

module.exports = { verificarToken };

  