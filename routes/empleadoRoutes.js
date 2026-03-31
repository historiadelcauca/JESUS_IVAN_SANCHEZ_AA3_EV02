const express = require("express");

module.exports = (conexion) => {
  const ruta = express.Router();

  // =========================
  // GET - Listar empleados (SIN password)
  // =========================
  ruta.get("/", (req, res) => {
    const sql = "SELECT idEmpleado, nombre, rol, usuario FROM empleados ORDER BY idEmpleado DESC";

    conexion.query(sql, (error, resultados) => {
      if (error) {
        console.error("Error listando empleados:", error);
        return res.status(500).json({
          ok: false,
          mensaje: "Error al listar empleados",
        });
      }

      return res.status(200).json({
        ok: true,
        data: resultados,
      });
    });
  });

  // =========================
  // GET por ID (SIN password)
  // =========================
  ruta.get("/:idEmpleado", (req, res) => {
    const idEmpleado = Number(req.params.idEmpleado);

    if (!Number.isInteger(idEmpleado) || idEmpleado <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "ID inválido",
      });
    }

    const sql = "SELECT idEmpleado, nombre, rol, usuario FROM empleados WHERE idEmpleado = ?";

    conexion.query(sql, [idEmpleado], (error, resultados) => {
      if (error) {
        console.error("Error buscando empleado:", error);
        return res.status(500).json({
          ok: false,
          mensaje: "Error al buscar empleado",
        });
      }

      if (resultados.length === 0) {
        return res.status(404).json({
          ok: false,
          mensaje: "Empleado no encontrado",
        });
      }

      return res.status(200).json({
        ok: true,
        data: resultados[0],
      });
    });
  });

  // =========================
  // POST - Crear empleado (valida campos)
  // =========================
  ruta.post("/", (req, res) => {
    const nombre = typeof req.body.nombre === "string" ? req.body.nombre.trim() : "";
    const rol = typeof req.body.rol === "string" ? req.body.rol.trim() : "";
    const usuario = typeof req.body.usuario === "string" ? req.body.usuario.trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password.trim() : "";

    if (!nombre || !rol || !usuario || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: "Todos los campos son obligatorios: nombre, rol, usuario, password",
      });
    }

    const sql = "INSERT INTO empleados (nombre, rol, usuario, password) VALUES (?, ?, ?, ?)";

    conexion.query(sql, [nombre, rol, usuario, password], (error, resultado) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            ok: false,
            mensaje: "El usuario ya existe",
          });
        }

        console.error("Error creando empleado:", error);
        return res.status(500).json({
          ok: false,
          mensaje: "Error al crear empleado",
        });
      }

      return res.status(201).json({
        ok: true,
        mensaje: "Empleado creado correctamente",
        data: {
          idEmpleado: resultado.insertId,
          nombre,
          rol,
          usuario,
        },
      });
    });
  });

  // =========================
  // PUT - Actualizar empleado (valida ID y campos)
  // =========================
  ruta.put("/:idEmpleado", (req, res) => {
    const idEmpleado = Number(req.params.idEmpleado);

    if (!Number.isInteger(idEmpleado) || idEmpleado <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "ID inválido",
      });
    }

    const nombre = typeof req.body.nombre === "string" ? req.body.nombre.trim() : "";
    const rol = typeof req.body.rol === "string" ? req.body.rol.trim() : "";
    const usuario = typeof req.body.usuario === "string" ? req.body.usuario.trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password.trim() : "";

    if (!nombre || !rol || !usuario || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: "Todos los campos son obligatorios: nombre, rol, usuario, password",
      });
    }

    const sql = "UPDATE empleados SET nombre = ?, rol = ?, usuario = ?, password = ? WHERE idEmpleado = ?";

    conexion.query(sql, [nombre, rol, usuario, password, idEmpleado], (error, resultado) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            ok: false,
            mensaje: "El usuario ya existe",
          });
        }

        console.error("Error actualizando empleado:", error);
        return res.status(500).json({
          ok: false,
          mensaje: "Error al actualizar empleado",
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          ok: false,
          mensaje: "Empleado no encontrado",
        });
      }

      return res.status(200).json({
        ok: true,
        mensaje: "Empleado actualizado correctamente",
        data: {
          idEmpleado,
          nombre,
          rol,
          usuario,
        },
      });
    });
  });

  // =========================
  // DELETE - Eliminar empleado
  // =========================
  ruta.delete("/:idEmpleado", (req, res) => {
    const idEmpleado = Number(req.params.idEmpleado);

    if (!Number.isInteger(idEmpleado) || idEmpleado <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "ID inválido",
      });
    }

    const sql = "DELETE FROM empleados WHERE idEmpleado = ?";

    conexion.query(sql, [idEmpleado], (error, resultado) => {
      if (error) {
        console.error("Error eliminando empleado:", error);
        return res.status(500).json({
          ok: false,
          mensaje: "Error al eliminar empleado",
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          ok: false,
          mensaje: "Empleado no encontrado",
        });
      }

      return res.status(200).json({
        ok: true,
        mensaje: "Empleado eliminado correctamente",
      });
    });
  });

  return ruta;
};