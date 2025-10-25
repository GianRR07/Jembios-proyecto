// servidor.js (orden recomendado)
const express = require('express');
const cors = require('cors');
const path = require('path');

// Routers
const ventasRouter = require('./routes/ventas.routes');
const facturasRouter = require('./routes/facturas.routes');
const marketingRouter = require('./routes/marketing.routes');
// NUEVO:
const productsRouter = require('./routes/products.routes');
const shippingRouter = require('./routes/shipping.routes');
const couponsRouter = require('./routes/coupons.routes');
const ordersRouter = require('./routes/orders.routes');
const tasksRouter = require('./routes/tasks.routes');
const deliveriesRouter = require('./routes/deliveries.routes');
const complaintsRouter = require('./routes/complaints.routes');
const authRouter = require('./routes/auth.routes');   // <— NUEVO


const app = express();
const PORT = 5000;

// Middlewares base
app.use(cors());
app.use(express.json());

// Static para uploads (después de crear app)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const serveIndex = require('serve-index');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', serveIndex(path.join(__dirname, 'uploads'), { icons: true }));


// Prefijos de API por proceso
app.use('/api/ventas', ventasRouter);
app.use('/api/facturas', facturasRouter);
app.use('/api/marketing', marketingRouter);

// NUEVO:
app.use('/api/products', productsRouter);
app.use('/api/shipping', shippingRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/deliveries', deliveriesRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/auth', authRouter);                     // <— NUEVO


// Health check
app.get('/', (req, res) => {
  res.json({ ok: true, name: 'backend', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
