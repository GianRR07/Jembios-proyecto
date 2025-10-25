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
    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    await runFileSQL(schemaPath);
    console.log('Schema aplicado ✅');

    await runFileSQL(seedPath);
    console.log('Seed insertado ✅');

    console.log('DB lista en', path.join(__dirname, 'database.db'));
  } catch (err) {
    console.error('Error inicializando DB:', err.message);
    process.exit(1);
  } finally {
    db.close();
  }
})();
