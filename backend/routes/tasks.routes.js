const { Router } = require('express');
const db = require('../db/connect');
const router = Router();

/**
 * GET /api/tasks
 * Query opcional: status (pending|in_progress|done) o orderId
 */
router.get('/', (req, res) => {
  const { status, orderId } = req.query;
  const where = [];
  const params = [];

  if (status) { where.push('t.status = ?'); params.push(status); }
  if (orderId) { where.push('t.order_id = ?'); params.push(Number(orderId)); }

  const sql = `
    SELECT t.id, t.order_id, t.assignee_id, e.name AS assignee_name, t.type, t.status, t.created_at
    FROM tasks t
    LEFT JOIN employees e ON e.id = t.assignee_id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY t.created_at DESC
  `;

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/**
 * PATCH /api/tasks/:id
 * Body: { status?: 'pending'|'in_progress'|'done', assignee_id?: number }
 */
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { status, assignee_id } = req.body || {};
  if (!id) return res.status(400).json({ error: 'id inválido' });

  const sets = [];
  const params = [];

  if (status) { sets.push('status = ?'); params.push(status); }
  if (typeof assignee_id === 'number') { sets.push('assignee_id = ?'); params.push(assignee_id); }

  if (sets.length === 0) return res.status(400).json({ error: 'Nada para actualizar' });

  params.push(id);

  db.run(
    `UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`,
    params,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Task no encontrada' });
      res.json({ ok: true });
    }
  );
});

module.exports = router;
