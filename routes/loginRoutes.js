const express = require("express");
const router  = express.Router();

module.exports = (conexion) => {

  router.post("/", async (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({
        ok: false,
        mensaje: "Usuario y contraseña son obligatorios"
      });
    }

    try {
      const [rows] = await conexion.query(
        "SELECT idEmpleado, nombre, usuario FROM empleados WHERE usuario = ? AND `password` = ?",
        [usuario, contrasena]
      );

      if (rows.length === 0) {
        return res.status(401).json({
          ok: false,
          mensaje: "Credenciales incorrectas"
        });
      }

      // No enviar la contraseña al frontend
      delete rows[0].password;

      res.json({
        ok: true,
        mensaje: "Inicio de sesión exitoso.",
        empleado: rows[0]
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        mensaje: "Error en el servidor"
      });
    }
  });

  return router;
};