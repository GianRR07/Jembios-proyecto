// backend/db/connect.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('❌ Error al conectar DB:', err.message);
});

// PRAGMAs recomendados
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON;');
  // Opcionales, pero útiles:
  db.run('PRAGMA journal_mode=WAL;');   // mejor concurrencia
  db.run('PRAGMA busy_timeout=3000;');  // evita "database is locked" rápidos
});

module.exports = db;
