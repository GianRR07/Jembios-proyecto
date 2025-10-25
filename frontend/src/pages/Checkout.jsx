import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../store/cart.jsx';
import { apiCreateOrder } from '../services/api';
import { useState } from 'react';

export default function CheckoutPage() {
  const nav = useNavigate();
  const { state } = useLocation() || {};
  const { items, clear } = useCart();

  const [form, setForm] = useState({
    name: '',
    docType: 'DNI',
    doc: '',
    email: '',
    phone: '',
    address: '',
    district: state?.district || 'Lima Centro',
    city: 'Lima',
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  if (!items.length) {
    return (
      <div style={{ padding: 16 }}>
        <div>No hay items en el carrito.</div>
        <Link to="/">Volver al catálogo</Link>
      </div>
    );
  }

  async function submit() {
    setErr('');
    setLoading(true);
    try {
      const payload = {
        customer: form,
        items: items.map(it => ({ productId: it.product.id, qty: it.qty })),
        // el descuento real se recalcula server-side si mandas couponCode,
        // por simplicidad en este MVP no lo enviamos.
        // couponCode: state?.coupon?.code
      };
      const res = await apiCreateOrder(payload);
      clear();
      nav(`/order/${res.id}`);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Checkout</h2>
      <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
        <input placeholder="Nombre completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <select value={form.docType} onChange={e => setForm({ ...form, docType: e.target.value })}>
          <option>DNI</option>
          <option>RUC</option>
        </select>
        <input placeholder="Documento" value={form.doc} onChange={e => setForm({ ...form, doc: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Teléfono" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Dirección" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        <input placeholder="Distrito" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} />
        <input placeholder="Ciudad" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
        {err && <div style={{ color: 'red' }}>{err}</div>}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/cart">← Volver</Link>
          <button onClick={submit} disabled={loading}>{loading ? 'Creando...' : 'Crear orden'}</button>
        </div>
      </div>
    </div>
  );
}
