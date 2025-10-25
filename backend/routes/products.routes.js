const { Router } = require('express');
const db = require('../db/connect');
const router = Router();

/**
 * GET /api/products
 * Filtros opcionales: q, category, minPrice, maxPrice
 */
router.get('/', (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;

  const where = [];
  const params = [];

  if (q) {
    where.push('(name LIKE ? OR category LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }
  if (category) {
    where.push('category = ?');
    params.push(category);
  }
  if (minPrice) {
    where.push('price >= ?');
    params.push(Number(minPrice));
  }
  if (maxPrice) {
    where.push('price <= ?');
    params.push(Number(maxPrice));
  }

  const sql = `
    SELECT id, name, category, price, stock, weight, active
    FROM products
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY id DESC
  `;

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
