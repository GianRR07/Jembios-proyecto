-- ROLES
CREATE TABLE IF NOT EXISTS roles (
  id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_rol TEXT UNIQUE NOT NULL
);

INSERT OR IGNORE INTO roles(nombre_rol) VALUES ('Administrador');
INSERT OR IGNORE INTO roles(nombre_rol) VALUES ('Marketing');
INSERT OR IGNORE INTO roles(nombre_rol) VALUES ('Cliente');

-- USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  correo TEXT UNIQUE NOT NULL,
  telefono TEXT,
  password TEXT NOT NULL,
  id_rol INTEGER NOT NULL,
  estado TEXT DEFAULT 'activo',
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);

-- PRODUCTOS PENDIENTES (para aprobación de Marketing)
CREATE TABLE IF NOT EXISTS productos_pendientes (
  id_pendiente INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  principio_activo TEXT,
  descripcion TEXT,
  sku TEXT,
  precio REAL NOT NULL CHECK(precio>=0),
  categoria TEXT,
  imagen_url TEXT,
  certificado_url TEXT,
  estado TEXT DEFAULT 'pendiente'
);
