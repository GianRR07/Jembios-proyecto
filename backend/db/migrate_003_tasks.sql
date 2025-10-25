-- EMPLOYEES
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT,
  active INTEGER NOT NULL DEFAULT 1
);

-- TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  assignee_id INTEGER,         -- empleado asignado
  type TEXT NOT NULL,          -- 'picking' | 'packing' | 'qa'
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending'|'in_progress'|'done'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY(assignee_id) REFERENCES employees(id)
);

-- TASK ITEMS (para checklist, opcional)
CREATE TABLE IF NOT EXISTS task_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks(order_id);
