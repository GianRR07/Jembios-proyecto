// === DEPENDENCIAS PRINCIPALES ===
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// === CONFIGURACIÓN BÁSICA ===
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// === CONEXIÓN A LA BASE DE DATOS ===
const dbPath = path.join(__dirname, 'db', 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('❌ Error al conectar a la base de datos:', err.message);
  else console.log('✅ Conectado a la base de datos SQLite');
});

// === CREAR TABLAS DESDE EL SCHEMA.SQL ===
const schemaPath = path.join(__dirname, 'db', 'schema.sql');
try {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema, (err) => {
    if (err) console.error('❌ Error al crear tablas:', err.message);
    else console.log('✅ Tablas verificadas/creadas correctamente');
  });
} catch (e) {
  console.error('⚠️ No se pudo leer el schema.sql:', e.message);
}

// === RUTAS PRINCIPALES DEL SISTEMA ===
const ventasRouter = require('./routes/ventas.routes');
const facturasRouter = require('./routes/facturas.routes');
const marketingRouter = require('./routes/marketing.routes');

// ===============================================
// 🚀 RUTAS DE LOGIN Y REGISTRO (VERSIÓN SIMPLE)
// ===============================================
const authRouter = express.Router();

// 👉 REGISTRAR USUARIO (sin cifrado)
authRouter.post('/register', (req, res) => {
  const { nombre, correo, telefono, direccion, password, id_rol } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const query = `
    INSERT INTO usuarios (nombre, correo, telefono, direccion, password, id_rol)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [nombre, correo, telefono, direccion, password, id_rol || 3], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al registrar usuario', detalle: err.message });
    }
    res.json({ ok: true, id_usuario: this.lastID, message: 'Usuario registrado correctamente' });
  });
});

// 👉 LOGIN DE USUARIO (sin validación segura)
authRouter.post('/login', (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  const query = `SELECT * FROM usuarios WHERE correo = ? AND password = ?`;

  db.get(query, [correo, password], (err, usuario) => {
    if (err) return res.status(500).json({ error: 'Error al buscar usuario' });
    if (!usuario) return res.status(404).json({ error: 'Usuario o contraseña incorrectos' });

    res.json({
      ok: true,
      message: 'Login exitoso',
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        id_rol: usuario.id_rol
      }
    });
  });
});

// 👉 LISTAR USUARIOS (solo para pruebas)
authRouter.get('/usuarios', (req, res) => {
  db.all(`SELECT id_usuario, nombre, correo, id_rol FROM usuarios`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al listar usuarios' });
    res.json(rows);
  });
});

// === MONTAR RUTAS ===
app.use('/api/auth', authRouter);
app.use('/api/ventas', ventasRouter);
app.use('/api/facturas', facturasRouter);
app.use('/api/marketing', marketingRouter);

// === RUTA RAÍZ ===
app.get('/', (req, res) => {
  res.json({ ok: true, name: 'backend', version: '1.0.0' });
});

// === INICIO DEL SERVIDOR ===
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
