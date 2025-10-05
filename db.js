const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("hotel.db", (err) => {
  if (err) {
    console.error("❌ Erro ao conectar:", err.message);
  } else {
    console.log("✅ Conectado ao banco SQLite");
  }
});

module.exports = db;
