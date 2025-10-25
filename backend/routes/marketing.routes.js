const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// DB
const dbPath = path.join(__dirname, '../db/database.db');
const db = new sqlite3.Database(dbPath);

// Carpeta de uploads
const uploadPath = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname),
});
const upload = multer({ storage });

// 👉 Enviar producto pendiente
router.post(
  '/productos/pendientes',
  upload.fields([
    { name: 'imagen', maxCount: 1 },
    { name: 'certificado', maxCount: 1 },
  ]),
  (req, res) => {
    const { nombre, principioActivo, descripcion, sku, precio, categoria } = req.body;
    const imagen = req.files['imagen'] ? req.files['imagen'][0].filename : null;
    const certificado = req.files['certificado'] ? req.files['certificado'][0].filename : null;

    const query = `
      INSERT INTO productos_pendientes 
      (nombre, principio_activo, descripcion, sku, precio, categoria, imagen_url, certificado_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [nombre, principioActivo, descripcion, sku, precio, categoria, imagen, certificado], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true, id: this.lastID, message: 'Producto pendiente enviado' });
    });
  }
);

// 👉 Listar productos pendientes
router.get('/productos/pendientes', (req, res) => {
  db.all('SELECT * FROM productos_pendientes WHERE estado="pendiente"', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 👉 Aprobar producto pendiente
router.post('/productos/aprobar/:id', (req, res) => {
  const id = req.params.id;

  db.get('SELECT * FROM productos_pendientes WHERE id_pendiente = ?', [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Producto no encontrado' });

    const queryInsert = `
      INSERT INTO productos
      (nombre, principio_activo, descripcion, sku, precio, categoria, imagen_url, certificado_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(queryInsert, [row.nombre, row.principio_activo, row.descripcion, row.sku, row.precio, row.categoria, row.imagen_url, row.certificado_url], function(err2) {
      if (err2) return res.status(500).json({ error: err2.message });

      // Actualizar estado a aprobado
      db.run('UPDATE productos_pendientes SET estado="aprobado" WHERE id_pendiente = ?', [id], () => {
        res.json({ ok: true, message: 'Producto aprobado y agregado a la tienda' });
      });
    });
  });
});

module.exports = router;
