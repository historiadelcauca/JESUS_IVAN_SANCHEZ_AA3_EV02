const express = require("express");

module.exports = (conexion) => {
  const ruta = express.Router();

  // =========================================================
  // Helpers (respuestas consistentes + validaciones)
  // =========================================================
  const sendOk = (res, status, payload) => res.status(status).json({ ok: true, ...payload });
  const sendFail = (res, status, mensaje, extra = {}) =>
    res.status(status).json({ ok: false, mensaje, ...extra });

  const toInt = (value) => {
    const n = Number(value);
    return Number.isInteger(n) ? n : NaN;
  };

  const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : NaN;
  };

  const normalizeMetodoPago = (metodoPago) => String(metodoPago || "").trim();

  const METODOS_PERMITIDOS = new Set([
    "Efectivo",
    "Tarjeta",
    "Transferencia",
    "Nequi",
    "Daviplata",
  ]);

  // =========================================================
  // GET - Ruta de prueba
  // GET /app/ventas
  // =========================================================
  ruta.get("/", (req, res) => {
    return sendOk(res, 200, { mensaje: "Módulo ventas funcionando" });
  });

  // =========================================================
  // GET - Listar ventas
  // GET /app/ventas/listar
  // =========================================================
  ruta.get("/listar", async (req, res) => {
    try {
      const [rows] = await conexion.promise().query(
        `SELECT 
          v.idVenta,
          v.fechaHora,
          CAST(v.totalPagar AS DECIMAL(10,2)) AS totalPagar,
          v.metodoPago,
          v.estado,
          e.nombre AS empleado,
          c.nombre AS cliente
        FROM ventas v
        LEFT JOIN empleados e ON v.idEmpleado = e.idEmpleado
        LEFT JOIN clientes c ON v.idCliente = c.idCliente
        ORDER BY v.idVenta DESC`
      );

      const data = rows.map((r) => ({
        ...r,
        totalPagar: Number(r.totalPagar),
      }));

      return sendOk(res, 200, { data });
    } catch (error) {
      console.error("Error listando ventas:", error);
      return sendFail(res, 500, "Error interno del servidor");
    }
  });

  // =========================================================
  // GET - Detalle de una venta por ID (cabecera + productos)
  // GET /app/ventas/:idVenta
  // =========================================================
  ruta.get("/:idVenta", async (req, res) => {
    try {
      const idVenta = toInt(req.params.idVenta);
      if (!Number.isInteger(idVenta) || idVenta <= 0) {
        return sendFail(res, 400, "idVenta inválido");
      }

      // Cabecera
      const [ventaRows] = await conexion.promise().query(
        `SELECT 
          v.idVenta,
          v.fechaHora,
          CAST(v.totalPagar AS DECIMAL(10,2)) AS totalPagar,
          v.metodoPago,
          v.estado,
          e.nombre AS empleado,
          c.nombre AS cliente
        FROM ventas v
        LEFT JOIN empleados e ON v.idEmpleado = e.idEmpleado
        LEFT JOIN clientes c ON v.idCliente = c.idCliente
        WHERE v.idVenta = ?`,
        [idVenta]
      );

      if (ventaRows.length === 0) {
        return sendFail(res, 404, `Venta con ID ${idVenta} no encontrada`);
      }

      // Detalle
      const [detalleRows] = await conexion.promise().query(
        `SELECT 
          p.idProducto,
          p.nombre AS nombreProducto,
          p.codigoBarra,
          dv.cantidad,
          CAST(dv.precioUnitario AS DECIMAL(10,2)) AS precioUnitario,
          CAST(dv.subtotal AS DECIMAL(10,2)) AS subtotalLinea
        FROM detalle_ventas dv
        JOIN productos p ON dv.idProducto = p.idProducto
        WHERE dv.idVenta = ?
        ORDER BY p.nombre ASC`,
        [idVenta]
      );

      const venta = ventaRows[0];

      return sendOk(res, 200, {
        idVenta: venta.idVenta,
        fechaHora: venta.fechaHora,
        totalPagar: Number(venta.totalPagar),
        metodoPago: venta.metodoPago,
        estado: venta.estado,
        empleado: venta.empleado,
        cliente: venta.cliente,
        productos: detalleRows.map((x) => ({
          ...x,
          cantidad: Number(x.cantidad),
          precioUnitario: Number(x.precioUnitario),
          subtotalLinea: Number(x.subtotalLinea),
        })),
      });
    } catch (error) {
      console.error("Error consultando venta:", error);
      return sendFail(res, 500, "Error interno del servidor");
    }
  });

  // =========================================================
  // POST - Registrar venta completa (TRANSACCIÓN REAL)
  // POST /app/ventas
  // =========================================================
  ruta.post("/", async (req, res) => {
    let conn;

    try {
      const { idEmpleado, idCliente, metodoPago, productos } = req.body;

      const empleadoNum = toInt(idEmpleado);
      const clienteNum =
        idCliente === undefined || idCliente === null || String(idCliente).trim() === ""
          ? null
          : toInt(idCliente);

      if (!Number.isInteger(empleadoNum) || empleadoNum <= 0) {
        return sendFail(res, 400, "idEmpleado inválido");
      }

      if (clienteNum !== null && (!Number.isInteger(clienteNum) || clienteNum <= 0)) {
        return sendFail(res, 400, "idCliente inválido");
      }

      const metodo = normalizeMetodoPago(metodoPago);
      if (!metodo) {
        return sendFail(res, 400, "metodoPago es obligatorio");
      }

      if (!METODOS_PERMITIDOS.has(metodo)) {
        return sendFail(
          res,
          400,
          `metodoPago inválido. Use: ${Array.from(METODOS_PERMITIDOS).join(", ")}`
        );
      }

      if (!Array.isArray(productos) || productos.length === 0) {
        return sendFail(res, 400, "Debe enviar al menos un producto para la venta");
      }

      // Normalizar productos (si vienen repetidos, se suman cantidades)
      const mapa = new Map();

      for (const item of productos) {
        const idProd = toInt(item?.idProducto);
        const cant = toNumber(item?.cantidad);

        if (!Number.isInteger(idProd) || idProd <= 0 || !Number.isFinite(cant) || cant <= 0) {
          return sendFail(res, 400, "Cada producto debe tener idProducto válido y cantidad > 0");
        }

        mapa.set(idProd, (mapa.get(idProd) || 0) + cant);
      }

      const items = Array.from(mapa.entries()).map(([idProducto, cantidad]) => ({
        idProducto,
        cantidad,
      }));

      // =========================================================
      // TRANSACCIÓN
      // =========================================================
      conn = await conexion.promise().getConnection();
      await conn.beginTransaction();

      // validar que el empleado exista
      const [empRows] = await conn.query(
        "SELECT idEmpleado FROM empleados WHERE idEmpleado = ?",
        [empleadoNum]
      );
      if (empRows.length === 0) {
        await conn.rollback();
        return sendFail(res, 400, `El empleado ID ${empleadoNum} no existe`);
      }

      // validar cliente si viene
      if (clienteNum !== null) {
        const [cliRows] = await conn.query(
          "SELECT idCliente FROM clientes WHERE idCliente = ?",
          [clienteNum]
        );
        if (cliRows.length === 0) {
          await conn.rollback();
          return sendFail(res, 400, `El cliente ID ${clienteNum} no existe`);
        }
      }

      // 1) Calcular total + validar existencia + stock (FOR UPDATE)
      let totalPagar = 0;
      const detalle = [];

      for (const item of items) {
        const [rows] = await conn.query(
          `SELECT 
            p.precioVenta,
            i.stockActual
          FROM productos p
          JOIN inventario i ON i.idProducto = p.idProducto
          WHERE p.idProducto = ?
          FOR UPDATE`,
          [item.idProducto]
        );

        if (rows.length === 0) {
          await conn.rollback();
          return sendFail(
            res,
            404,
            `Producto con ID ${item.idProducto} no existe o no está en inventario`
          );
        }

        const precioUnitario = toNumber(rows[0].precioVenta);
        const stockActual = toNumber(rows[0].stockActual);

        if (!Number.isFinite(precioUnitario) || precioUnitario < 0) {
          await conn.rollback();
          return sendFail(res, 400, `Precio inválido para producto ID ${item.idProducto}`);
        }

        if (!Number.isFinite(stockActual) || stockActual < 0) {
          await conn.rollback();
          return sendFail(res, 400, `Stock inválido para producto ID ${item.idProducto}`);
        }

        if (item.cantidad > stockActual) {
          await conn.rollback();
          return sendFail(res, 400, `Stock insuficiente para el producto ID ${item.idProducto}`);
        }

        const subtotal = precioUnitario * item.cantidad;
        totalPagar += subtotal;

        detalle.push({
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          precioUnitario,
          subtotal,
        });
      }

      // 2) Insertar cabecera en ventas
      const [ventaResult] = await conn.query(
        `INSERT INTO ventas (fechaHora, totalPagar, metodoPago, estado, idEmpleado, idCliente)
         VALUES (NOW(), ?, ?, 'FINALIZADA', ?, ?)`,
        [Number(totalPagar.toFixed(2)), metodo, empleadoNum, clienteNum]
      );

      const idVenta = ventaResult.insertId;

      // 3) Insertar detalle_ventas + actualizar inventario
      for (const item of detalle) {
        await conn.query(
          `INSERT INTO detalle_ventas (idVenta, idProducto, cantidad, precioUnitario, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [
            idVenta,
            item.idProducto,
            item.cantidad,
            Number(item.precioUnitario.toFixed(2)),
            Number(item.subtotal.toFixed(2)),
          ]
        );

        const [upd] = await conn.query(
          `UPDATE inventario
           SET stockActual = stockActual - ?,
               fechaUltimaActualizacion = NOW()
           WHERE idProducto = ? AND stockActual >= ?`,
          [item.cantidad, item.idProducto, item.cantidad]
        );

        if (upd.affectedRows === 0) {
          await conn.rollback();
          return sendFail(res, 400, `No se pudo actualizar stock del producto ID ${item.idProducto}`);
        }
      }

      // 4) Commit
      await conn.commit();

      return sendOk(res, 201, {
        mensaje: "Venta registrada exitosamente y stock actualizado.",
        idVenta,
        totalPagar: Number(totalPagar.toFixed(2)),
      });
    } catch (error) {
      console.error("Error en Transacción de Venta:", error);

      if (conn) {
        try {
          await conn.rollback();
        } catch (rbErr) {
          console.error("Error durante rollback:", rbErr);
        }
      }

      return sendFail(res, 500, "Fallo al procesar la venta. La transacción fue revertida.", {
        errorDetails: error.message,
      });
    } finally {
      if (conn) conn.release();
    }
  });

  return ruta;
};