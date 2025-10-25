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

-- TABLA DE PRODUCTOS
CREATE TABLE IF NOT EXISTS productos (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    imagen_url TEXT
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

-- TABLA DE MARKETING (ejemplo)
CREATE TABLE IF NOT EXISTS marketing (
    id_marketing INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha_inicio TEXT,
    fecha_fin TEXT
);

-- Insertar roles iniciales si no existen
INSERT INTO roles (nombre_rol)
SELECT 'Administrador' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre_rol = 'Administrador');

INSERT INTO roles (nombre_rol)
SELECT 'Empleado' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre_rol = 'Empleado');

INSERT INTO roles (nombre_rol)
SELECT 'Cliente' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nombre_rol = 'Cliente');
