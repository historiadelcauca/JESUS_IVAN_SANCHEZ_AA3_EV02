const express = require("express");

module.exports = (conexion) => {
  const ruta = express.Router();

  // =========================
  // GET - Listar todos los clientes
  // =========================
  ruta.get("/", (req, res) => {
    const sql = `
      SELECT idCliente, nombre, telefono, puntosAcumulados
      FROM clientes
      ORDER BY idCliente DESC
    `;

    conexion.query(sql, (error, resultados) => {
      if (error) {
        console.error("Error al listar clientes:", error);
        return res.status(500).json({
          ok: false,
          mensaje: "Error al listar clientes"
        });
      }

      return res.status(200).json({
        ok: true,
        data: resultados
      });
    });
  });

  // =========================
  // GET - Buscar cliente por ID
  // =========================
  ruta.get("/:idCliente", (req, res) => {
    const { idCliente } = req.params;

    const sql = `
      SELECT idCliente, nombre, telefono, puntosAcumulados
      FROM clientes
      WHERE idCliente = ?
    `;

    conexion.query(sql, [idCliente], (error, resultados) => {
      if (error) {
        console.error("Error al buscar cliente:", error);
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar cliente"
        });
      }

      if (resultados.length === 0) {
        return res.status(404).json({
          ok: false,
          mensaje: "Cliente no encontrado"
        });
      }

      return res.status(200).json({
        ok: true,
        data: resultados[0]
      });
    });
  });

  // =========================
  // POST - Crear cliente
  // =========================
  ruta.post("/", (req, res) => {
    const { nombre, telefono, puntosAcumulados } = req.body;

    if (!nombre || !telefono) {
      return res.status(400).json({
        ok: false,
        mensaje: "Nombre y teléfono son obligatorios"
      });
    }

    const puntosFinales = puntosAcumulados !== undefined ? puntosAcumulados : 0;

    const sql = `
      INSERT INTO clientes (nombre, telefono, puntosAcumulados)
      VALUES (?, ?, ?)
    `;

    conexion.query(sql, [nombre, telefono, puntosFinales], (error, resultado) => {
      if (error) {
        console.error("Error al crear cliente:", error);
        return res.status(500).json({
          ok: false,
          mensaje: "Error al crear cliente"
        });
      }

      return res.status(201).json({
        ok: true,
        mensaje: "Cliente creado correctamente",
        idCliente: resultado.insertId
      });
    });
  });

  // =========================
  // PUT - Actualizar cliente por ID
  // =========================
  ruta.put("/:idCliente", (req, res) => {
    const { idCliente } = req.params;
    const { nombre, telefono, puntosAcumulados } = req.body;

    if (!nombre || !telefono) {
      return res.status(400).json({
        ok: false,
        mensaje: "Nombre y teléfono son obligatorios"
      });
    }

    const sql = `
      UPDATE clientes
      SET nombre = ?, telefono = ?, puntosAcumulados = ?
      WHERE idCliente = ?
    `;

    conexion.query(
      sql,
      [nombre, telefono, puntosAcumulados, idCliente],
      (error, resultado) => {
        if (error) {
          console.error("Error al actualizar cliente:", error);
          return res.status(500).json({
            ok: false,
            mensaje: "Error al actualizar cliente"
          });
        }

        if (resultado.affectedRows === 0) {
          return res.status(404).json({
            ok: false,
            mensaje: "Cliente no encontrado para actualizar"
          });
        }

        return res.status(200).json({
          ok: true,
          mensaje: "Cliente actualizado correctamente"
        });
      }
    );
  });

  // =========================
  // DELETE - Eliminar cliente por ID
  // =========================
  ruta.delete("/:idCliente", (req, res) => {
    const { idCliente } = req.params;

    const sql = `
      DELETE FROM clientes
      WHERE idCliente = ?
    `;

    conexion.query(sql, [idCliente], (error, resultado) => {
      if (error) {
        console.error("Error al eliminar cliente:", error);
        return res.status(500).json({
          ok: false,
          mensaje: "Error al eliminar cliente"
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          ok: false,
          mensaje: "Cliente no encontrado para eliminar"
        });
      }

      return res.status(200).json({
        ok: true,
        mensaje: "Cliente eliminado correctamente"
      });
    });
  });

  return ruta;
};