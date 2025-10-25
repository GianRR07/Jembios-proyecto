const fs = require('fs');
const path = require('path');
const db = require('./connect');

function runFileSQL(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => (err ? reject(err) : resolve()));
  });
}

(async () => {
  try {
    const migPath = path.join(__dirname, 'migrate_002_payments.sql');
    await runFileSQL(migPath);
    console.log('Migración payments aplicada ✅');
  } catch (err) {
    console.error('Error en migración:', err.message);
    process.exit(1);
  } finally {
    db.close();
  }
})();
