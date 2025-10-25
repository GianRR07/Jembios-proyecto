const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// database.db vivirá en /db
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

module.exports = db;
