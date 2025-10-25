<<<<<<< HEAD
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
=======
-- ============================================
-- 🧩 TABLAS BASE DE JEMBIOS - BACKEND
-- ============================================

-- TABLA DE ROLES
CREATE TABLE IF NOT EXISTS roles (
    id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_rol TEXT NOT NULL
);

-- TABLA DE USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    telefono TEXT,
    direccion TEXT,
    password TEXT NOT NULL,
    id_rol INTEGER NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- TABLA DE PRODUCTOS ACTIVOS
CREATE TABLE IF NOT EXISTS productos (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    principio_activo TEXT,
    descripcion TEXT,
    sku TEXT UNIQUE,
    precio REAL NOT NULL,
    categoria TEXT,
    imagen_url TEXT,
    certificado_url TEXT,
    aprobado INTEGER DEFAULT 1
);

-- TABLA DE PRODUCTOS PENDIENTES
CREATE TABLE IF NOT EXISTS productos_pendientes (
    id_pendiente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    principio_activo TEXT,
    descripcion TEXT,
    sku TEXT,
    precio REAL NOT NULL,
    categoria TEXT,
    imagen_url TEXT,
    certificado_url TEXT,
    estado TEXT DEFAULT 'pendiente', -- pendiente / aprobado / rechazado
    fecha_creacion TEXT DEFAULT (datetime('now'))
);

-- TABLA DE VENTAS
CREATE TABLE IF NOT EXISTS ventas (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    fecha TEXT DEFAULT (datetime('now')),
    total REAL NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- TABLA DETALLE DE VENTA
CREATE TABLE IF NOT EXISTS detalle_venta (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- TABLA DE FACTURAS
CREATE TABLE IF NOT EXISTS facturas (
    id_factura INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    numero_factura TEXT NOT NULL,
    fecha_emision TEXT DEFAULT (datetime('now')),
    total REAL NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta)
);

-- TABLA DE MARKETING
CREATE TABLE IF NOT EXISTS marketing (
    id_marketing INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha_inicio TEXT,
    fecha_fin TEXT
>>>>>>> cc9a1ac146a8e173ef5a1370527df11fa6a64843
);

-- TABLA DE PRODUCTOS PENDIENTES PARA APROBACION
CREATE TABLE IF NOT EXISTS productos_pendientes (
    id_pendiente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    principio_activo TEXT,
    descripcion TEXT,
    sku TEXT,
    precio REAL NOT NULL,
    categoria TEXT,
    imagen_url TEXT,
    certificado_url TEXT,
    estado TEXT DEFAULT 'pendiente'
);



-- Insertar roles iniciales si no existen
INSERT INTO roles (nombre_rol)
SELECT 'Administrador' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre_rol = 'Administrador');

INSERT INTO roles (nombre_rol)
SELECT 'Marketing' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre_rol = 'Marketing');

INSERT INTO roles (nombre_rol)
SELECT 'Cliente' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre_rol = 'Cliente');
