const fs = require('fs');
const path = require('path');
const db = require('./connect');

function runSQL(p) {
  const sql = fs.readFileSync(p, 'utf8');
  return new Promise((resolve, reject) => db.exec(sql, (e) => e ? reject(e) : resolve()));
}

(async () => {
  try {
    await runSQL(path.join(__dirname, 'migrate_006_orders_location.sql'));
    console.log('Migración orders: dest_lat/dest_lng ✅');
  } catch (e) {
    console.error('Error migración:', e.message);
    process.exit(1);
  } finally {
    db.close();
  }
})();
