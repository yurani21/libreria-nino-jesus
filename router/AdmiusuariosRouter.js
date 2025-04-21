const express = require("express");
const router = express.Router();
const db = require("../db.js");
const bcrypt = require("bcrypt");


// Obtener lista de correos e ID
router.get("/correos", (req, res) => {
    db.query("SELECT id, correo FROM administradores", (err, results) => {
      if (err) return res.status(500).json({ error: "Error al obtener correos" });
      res.json(results);
    });
  });
  

// 🔒 ACTUALIZAR CONTRASEÑA
router.put("/actualizar-password/:id", async (req, res) => {
  const { id } = req.params;
  const { nuevaPassword } = req.body;

  try {
    const hashed = await bcrypt.hash(nuevaPassword, 10);
    db.query(
      "UPDATE administradores SET password = ? WHERE id = ?",
      [hashed, id],
      (err, result) => {
        if (err) {
          console.error("Error al actualizar contraseña:", err);
          return res.status(500).json({ error: "Error al actualizar contraseña" });
        }
        res.json({ mensaje: "Contraseña actualizada correctamente" });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
