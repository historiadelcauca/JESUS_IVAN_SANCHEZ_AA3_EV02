const express = require("express");

module.exports = (conexion) => {
  const ruta = express.Router();

  // =========================
  // GET - Listar inventario completo con nombre de producto
  // GET /app/inventario
  // =========================
  ruta.get("/", async (req, res) => {
    try {
      const [rows] = await conexion.promise().query(
        `SELECT
          i.idInventario,
          i.idProducto,
          p.nombre        AS nombreProducto,
          p.codigoBarra,
          p.categoria,
          i.ubicacion,
          i.stockActual,
          i.stockMinimo,
          i.fechaUltimaActualizacion
        FROM inventario i
        JOIN productos p ON i.idProducto = p.idProducto
        ORDER BY i.idInventario ASC`
      );
      return res.status(200).json({ ok: true, data: rows });
    } catch (error) {
      console.error("Error listando inventario:", error);
      return res.status(500).json({ ok: false, mensaje: "Error al listar inventario" });
    }
  });

  // =========================
  // GET por ID
  // GET /app/inventario/:idInventario
  // =========================
  ruta.get("/:idInventario", async (req, res) => {
    const idInventario = Number(req.params.idInventario);
    if (!Number.isInteger(idInventario) || idInventario <= 0) {
      return res.status(400).json({ ok: false, mensaje: "ID inválido" });
    }
    try {
      const [rows] = await conexion.promise().query(
        `SELECT
          i.idInventario,
          i.idProducto,
          p.nombre        AS nombreProducto,
          p.codigoBarra,
          p.categoria,
          i.ubicacion,
          i.stockActual,
          i.stockMinimo,
          i.fechaUltimaActualizacion
        FROM inventario i
        JOIN productos p ON i.idProducto = p.idProducto
        WHERE i.idInventario = ?`,
        [idInventario]
      );
      if (rows.length === 0) {
        return res.status(404).json({ ok: false, mensaje: "Registro no encontrado" });
      }
      return res.status(200).json({ ok: true, data: rows[0] });
    } catch (error) {
      console.error("Error buscando inventario:", error);
      return res.status(500).json({ ok: false, mensaje: "Error al buscar registro" });
    }
  });

  // =========================
  // PUT - Actualizar ubicacion, stockActual y stockMinimo
  // PUT /app/inventario/:idInventario
  // =========================
  ruta.put("/:idInventario", async (req, res) => {
    const idInventario = Number(req.params.idInventario);
    if (!Number.isInteger(idInventario) || idInventario <= 0) {
      return res.status(400).json({ ok: false, mensaje: "ID inválido" });
    }

    const ubicacion   = typeof req.body.ubicacion   === "string" ? req.body.ubicacion.trim()   : "";
    const stockActual = Number(req.body.stockActual);
    const stockMinimo = Number(req.body.stockMinimo);

    if (!ubicacion) {
      return res.status(400).json({ ok: false, mensaje: "La ubicación es obligatoria" });
    }
    if (!Number.isFinite(stockActual) || stockActual < 0) {
      return res.status(400).json({ ok: false, mensaje: "Stock actual inválido" });
    }
    if (!Number.isFinite(stockMinimo) || stockMinimo < 0) {
      return res.status(400).json({ ok: false, mensaje: "Stock mínimo inválido" });
    }

    try {
      const [resultado] = await conexion.promise().query(
        `UPDATE inventario
         SET ubicacion   = ?,
             stockActual = ?,
             stockMinimo = ?,
             fechaUltimaActualizacion = NOW()
         WHERE idInventario = ?`,
        [ubicacion, stockActual, stockMinimo, idInventario]
      );
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ ok: false, mensaje: "Registro no encontrado" });
      }
      return res.status(200).json({
        ok: true,
        mensaje: "Inventario actualizado correctamente",
        data: { idInventario, ubicacion, stockActual, stockMinimo }
      });
    } catch (error) {
      console.error("Error actualizando inventario:", error);
      return res.status(500).json({ ok: false, mensaje: "Error al actualizar inventario" });
    }
  });

  return ruta;
};