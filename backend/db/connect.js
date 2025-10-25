const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Activa claves foráneas
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON;');
});

module.exports = db;
