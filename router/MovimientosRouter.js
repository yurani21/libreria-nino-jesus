const express = require("express");
const router = express.Router();
const db = require("../db");

// Registrar movimiento y actualizar stock
router.post("/api/movimientos", (req, res) => {
  const { Tipo, Producto_Id, Producto_Tipo, Cantidad } = req.body;

  // 1. Registrar movimiento
  const insertMovimiento = `
    INSERT INTO movimientos_inventario (Tipo, Producto_Id, Producto_Tipo, Cantidad, Fecha)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(insertMovimiento, [Tipo, Producto_Id, Producto_Tipo, Cantidad], (err) => {
    if (err) {
      console.error("Error al registrar movimiento:", err);
      return res.status(500).json({ error: "Error al registrar movimiento" });
    }

    // 2. Actualizar stock de esculturas si es ese tipo
    if (Producto_Tipo === "escultura") {
      const operacion = Tipo === "entrada" ? "+" : "-";
      const actualizarStock = `
        UPDATE esculturas
        SET Esc_Stock = Esc_Stock ${operacion} ?
        WHERE Id_Escultura = ?
      `;

      db.query(actualizarStock, [Cantidad, Producto_Id], (err) => {
        if (err) {
          console.error("Error al actualizar stock:", err);
          return res.status(500).json({ error: "Error al actualizar stock de escultura" });
        }

        res.json({ message: "Movimiento registrado y stock actualizado correctamente" });
      });
    } else {
      res.status(400).json({ error: "Tipo de producto no válido para esta ruta" });
    }
  });
});

module.exports = router;
