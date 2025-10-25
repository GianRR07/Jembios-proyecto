CREATE TABLE IF NOT EXISTS deliveries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'created', -- created | en_route | delivered | failed
  tracking_code TEXT,
  carrier TEXT,                           -- opcional (simulado)
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_deliveries_order ON deliveries(order_id);
