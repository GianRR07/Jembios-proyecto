const { Router } = require('express');
const db = require('../db/connect');
const router = Router();

/**
 * POST /api/shipping/quote
 * Body: { district: string, items: [{ productId, qty }] }
 * costo = base_price + (price_per_kg * peso_total)
 */
router.post('/quote', (req, res) => {
  const { district, items } = req.body || {};
  if (!district || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'district e items son requeridos' });
  }

  db.get(
    'SELECT base_price, price_per_kg FROM shipping_rates WHERE district = ?',
    [district],
    (err, rate) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rate) return res.status(404).json({ error: 'No hay tarifa para ese distrito' });

      const ids = items.map(it => it.productId);
      const placeholders = ids.map(() => '?').join(',');
      db.all(
        `SELECT id, weight FROM products WHERE id IN (${placeholders})`,
        ids,
        (err2, prods) => {
          if (err2) return res.status(500).json({ error: err2.message });

          const weights = new Map(prods.map(p => [p.id, p.weight]));
          let totalWeight = 0;
          for (const it of items) {
            const w = weights.get(it.productId);
            if (typeof w !== 'number') {
              return res.status(400).json({ error: `Producto ${it.productId} no existe` });
            }
            totalWeight += w * Number(it.qty || 0);
          }

          const cost = rate.base_price + rate.price_per_kg * totalWeight;
          res.json({
            district,
            totalWeight,
            base: rate.base_price,
            perKg: rate.price_per_kg,
            cost: Number(cost.toFixed(2))
          });
        }
      );
    }
  );
});

module.exports = router;
