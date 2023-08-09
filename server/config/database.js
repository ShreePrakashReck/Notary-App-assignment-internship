//database connection estiblish
const mysql = require("mysql2");
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Shree12345@",
  database: "test_schema",
});

module.exports = db;
