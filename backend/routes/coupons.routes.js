const { Router } = require('express');
const db = require('../db/connect');
const router = Router();

/**
 * POST /api/coupons/validate
 * Body: { code: string, amount: number }
 */
router.post('/validate', (req, res) => {
  const { code, amount } = req.body || {};
  if (!code || typeof amount !== 'number') {
    return res.status(400).json({ error: 'code y amount son requeridos' });
  }

  db.get(
    `SELECT code, discount_type AS type, value, expires_at, min_amount
     FROM coupons WHERE code = ?`,
    [code],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.json({ valid: false, reason: 'not_found' });

      if (row.expires_at) {
        const now = new Date();
        const exp = new Date(row.expires_at);
        if (isNaN(exp.getTime()) || now > exp) {
          return res.json({ valid: false, reason: 'expired' });
        }
      }

      if (amount < row.min_amount) {
        return res.json({ valid: false, reason: 'min_amount' });
      }

      let discount = 0;
      if (row.type === 'percent') discount = (amount * row.value) / 100;
      if (row.type === 'fixed') discount = row.value;
      if (discount > amount) discount = amount;

      res.json({
        valid: true,
        code: row.code,
        type: row.type,
        value: row.value,
        discount: Number(discount.toFixed(2))
      });
    }
  );
});

module.exports = router;
