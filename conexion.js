const mysql = require("mysql2/promise");

const conexion = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "tiendita_martinez",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

conexion.query("SELECT 1").then(() => {
  console.log("Conectado a MySQL correctamente (POOL)");
}).catch((err) => {
  console.error("Error conectando a MySQL (POOL):", err.message);
});

module.exports = conexion;