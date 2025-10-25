-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  price REAL NOT NULL CHECK(price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
  weight REAL NOT NULL DEFAULT 0 CHECK(weight >= 0),
  active INTEGER NOT NULL DEFAULT 1
);

-- SHIPPING RATES (reglas locales simples)
CREATE TABLE IF NOT EXISTS shipping_rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  district TEXT NOT NULL,
  base_price REAL NOT NULL DEFAULT 0,
  price_per_kg REAL NOT NULL DEFAULT 0
);

-- COUPONS
CREATE TABLE IF NOT EXISTS coupons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK(discount_type IN ('percent','fixed')),
  value REAL NOT NULL CHECK(value >= 0),
  expires_at TEXT,            -- ISO date string o NULL
  min_amount REAL NOT NULL DEFAULT 0
);
