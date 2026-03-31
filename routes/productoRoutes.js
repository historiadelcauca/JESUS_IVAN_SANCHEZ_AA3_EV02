const express = require("express");

// Helpers de validación
function parsePositiveInt(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

function parseNonNegativeNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function parseOptionalDate(value) {
  if (value === undefined || value === null || value === "") return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return String(value);
}

module.exports = (conexion) => {
  const ruta = express.Router();

  // Mostrar todos los productos
  ruta.get("/", (req, res) => {
    const sql = "SELECT * FROM productos";

    conexion.query(sql, (err, rows) => {
      if (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({ ok: false, mensaje: "No hay productos registrados" });
      }

      return res.status(200).json({ ok: true, productos: rows });
    });
  });

  // Mostrar producto por id
  ruta.get("/:id", (req, res) => {
    const id = parsePositiveInt(req.params.id);

    if (!id) {
      return res.status(400).json({ ok: false, mensaje: "ID inválido" });
    }

    const sql = "SELECT * FROM productos WHERE idProducto = ?";

    conexion.query(sql, [id], (err, rows) => {
      if (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({ ok: false, mensaje: "No se encontró el producto" });
      }

      return res.status(200).json({ ok: true, producto: rows[0] });
    });
  });

  // Crear producto
  ruta.post("/", (req, res) => {
    const {
      categoria_id,
      nombre,
      codigoBarra,
      precioVenta,
      precioCompra,
      categoria,
      unidadMedida,
      fechaVencimiento,
    } = req.body;

    if (
      categoria_id === undefined ||
      nombre === undefined ||
      codigoBarra === undefined ||
      precioVenta === undefined ||
      precioCompra === undefined ||
      categoria === undefined ||
      unidadMedida === undefined
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Faltan datos obligatorios (categoria_id, nombre, codigoBarra, precioVenta, precioCompra, categoria, unidadMedida)",
      });
    }

    const categoriaIdNum = parsePositiveInt(categoria_id);
    if (!categoriaIdNum) {
      return res.status(400).json({ ok: false, mensaje: "categoria_id inválido" });
    }

    const pv = parseNonNegativeNumber(precioVenta);
    if (pv === null) {
      return res.status(400).json({ ok: false, mensaje: "precioVenta inválido" });
    }

    const pc = parseNonNegativeNumber(precioCompra);
    if (pc === null) {
      return res.status(400).json({ ok: false, mensaje: "precioCompra inválido" });
    }

    const nombreStr    = String(nombre).trim();
    const codigoStr    = String(codigoBarra).trim();
    const categoriaStr = String(categoria).trim();
    const unidadStr    = String(unidadMedida).trim();

    if (!nombreStr || !codigoStr || !categoriaStr || !unidadStr) {
      return res.status(400).json({
        ok: false,
        mensaje: "nombre, codigoBarra, categoria y unidadMedida no pueden estar vacíos",
      });
    }

    const fv = parseOptionalDate(fechaVencimiento);
    if (fv === undefined) {
      return res.status(400).json({ ok: false, mensaje: "fechaVencimiento inválida" });
    }

    const nuevoProducto = {
      categoria_id: categoriaIdNum,
      nombre: nombreStr,
      codigoBarra: codigoStr,
      precioVenta: pv,
      precioCompra: pc,
      categoria: categoriaStr,
      unidadMedida: unidadStr,
      fechaVencimiento: fv,
    };

    const sql = "INSERT INTO productos SET ?";

    conexion.query(sql, nuevoProducto, (err, resultado) => {
      if (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }

      return res.status(201).json({
        ok: true,
        mensaje: "Producto creado correctamente",
        producto: { idProducto: resultado.insertId, ...nuevoProducto },
      });
    });
  });

  // Actualizar producto
  ruta.put("/:id", (req, res) => {
    const id = parsePositiveInt(req.params.id);

    if (!id) {
      return res.status(400).json({ ok: false, mensaje: "ID inválido" });
    }

    const {
      categoria_id,
      nombre,
      codigoBarra,
      precioVenta,
      precioCompra,
      categoria,
      unidadMedida,
      fechaVencimiento,
    } = req.body;

    if (
      categoria_id === undefined ||
      nombre === undefined ||
      codigoBarra === undefined ||
      precioVenta === undefined ||
      precioCompra === undefined ||
      categoria === undefined ||
      unidadMedida === undefined
    ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Faltan datos obligatorios (categoria_id, nombre, codigoBarra, precioVenta, precioCompra, categoria, unidadMedida)",
      });
    }

    const categoriaIdNum = parsePositiveInt(categoria_id);
    if (!categoriaIdNum) {
      return res.status(400).json({ ok: false, mensaje: "categoria_id inválido" });
    }

    const pv = parseNonNegativeNumber(precioVenta);
    if (pv === null) {
      return res.status(400).json({ ok: false, mensaje: "precioVenta inválido" });
    }

    const pc = parseNonNegativeNumber(precioCompra);
    if (pc === null) {
      return res.status(400).json({ ok: false, mensaje: "precioCompra inválido" });
    }

    const nombreStr    = String(nombre).trim();
    const codigoStr    = String(codigoBarra).trim();
    const categoriaStr = String(categoria).trim();
    const unidadStr    = String(unidadMedida).trim();

    if (!nombreStr || !codigoStr || !categoriaStr || !unidadStr) {
      return res.status(400).json({
        ok: false,
        mensaje: "nombre, codigoBarra, categoria y unidadMedida no pueden estar vacíos",
      });
    }

    const fv = parseOptionalDate(fechaVencimiento);
    if (fv === undefined) {
      return res.status(400).json({ ok: false, mensaje: "fechaVencimiento inválida" });
    }

    const sql = `
      UPDATE productos
      SET categoria_id = ?,
          nombre = ?,
          codigoBarra = ?,
          precioVenta = ?,
          precioCompra = ?,
          categoria = ?,
          unidadMedida = ?,
          fechaVencimiento = ?
      WHERE idProducto = ?
    `;

    const valores = [
      categoriaIdNum,
      nombreStr,
      codigoStr,
      pv,
      pc,
      categoriaStr,
      unidadStr,
      fv,
      id,
    ];

    conexion.query(sql, valores, (err, resultado) => {
      if (err) {
        return res.status(500).json({ ok: false, error: err.message });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ ok: false, mensaje: "No se encontró el producto para actualizar" });
      }

      return res.status(200).json({
        ok: true,
        mensaje: "Producto actualizado correctamente",
        producto: {
          idProducto: id,
          categoria_id: categoriaIdNum,
          nombre: nombreStr,
          codigoBarra: codigoStr,
          precioVenta: pv,
          precioCompra: pc,
          categoria: categoriaStr,
          unidadMedida: unidadStr,
          fechaVencimiento: fv,
        },
      });
    });
  });

  // Eliminar producto (primero elimina inventario relacionado)
  ruta.delete("/:id", (req, res) => {
    const id = parsePositiveInt(req.params.id);

    if (!id) {
      return res.status(400).json({ ok: false, mensaje: "ID inválido" });
    }

    // Paso 1: eliminar registros de inventario relacionados
    const sqlInventario = "DELETE FROM inventario WHERE idProducto = ?";

    conexion.query(sqlInventario, [id], (errInv) => {
      if (errInv) {
        console.error("Error al eliminar inventario del producto:", errInv);
        return res.status(500).json({ ok: false, error: errInv.message });
      }

      // Paso 2: eliminar el producto
      const sqlProducto = "DELETE FROM productos WHERE idProducto = ?";

      conexion.query(sqlProducto, [id], (errProd, resultado) => {
        if (errProd) {
          console.error("Error al eliminar producto:", errProd);
          return res.status(500).json({ ok: false, error: errProd.message });
        }

        if (resultado.affectedRows === 0) {
          return res.status(404).json({ ok: false, mensaje: "No se encontró el producto para eliminar" });
        }

        return res.status(200).json({
          ok: true,
          mensaje: "Producto eliminado correctamente",
          idProducto: id,
        });
      });
    });
  });

  return ruta;
};