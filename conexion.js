const mysql = require("mysql2");

const conexion = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "tiendita_martinez",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

conexion.query("SELECT 1", (err) => {
  if (err) {
    console.error("Error conectando a MySQL (POOL):", err.message);
    return;
  }
  console.log("Conectado a MySQL correctamente (POOL)");
});

module.exports = conexion;