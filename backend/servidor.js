const express = require('express');
const cors = require('cors');

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





const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

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






// Health check
app.get('/', (req, res) => {
  res.json({ ok: true, name: 'backend', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
