const express = require("express");
const cors    = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use(function(req, res, next) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

const conexion = require("./conexion");

const empleadoRoutes   = require("./routes/empleadoRoutes");
const productoRoutes   = require("./routes/productoRoutes");
const ventaRoutes      = require("./routes/ventaRoutes");
const clienteRoutes    = require("./routes/clienteRoutes");
const inventarioRoutes = require("./routes/inventarioRoutes");
const loginRoutes      = require("./routes/loginRoutes");

app.use("/app/empleados",  empleadoRoutes(conexion));
app.use("/app/productos",  productoRoutes(conexion));
app.use("/app/ventas",     ventaRoutes(conexion));
app.use("/app/clientes",   clienteRoutes(conexion));
app.use("/app/inventario", inventarioRoutes(conexion));
app.use("/app/login",      loginRoutes(conexion));

app.get("/", (req, res) => {
  res.status(200).send("Servidor funcionando correctamente");
});

const puerto = 3000;
app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});