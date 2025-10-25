const express = require('express');
const cors = require('cors');

const ventasRouter = require('./routes/ventas.routes');
const facturasRouter = require('./routes/facturas.routes');
const marketingRouter = require('./routes/marketing.routes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/ventas', ventasRouter);
app.use('/api/facturas', facturasRouter);
app.use('/api/marketing', marketingRouter);

app.get('/', (req, res) => {
  res.json({ ok: true, name: 'backend', version: '1.0.0' });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
