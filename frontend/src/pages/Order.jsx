import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGetOrder, apiPayOrder } from '../services/api';

export default function OrderPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr('');
    setLoading(true);
    try {
      const d = await apiGetOrder(id);
      setData(d);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function pay(result = 'success') {
    try {
      await apiPayOrder(id, { method: 'mock', result });
      await load();
    } catch (e) {
      alert(String(e.message || e));
    }
  }

  if (loading) return <div style={{ padding: 16 }}>Cargando orden...</div>;
  if (err) return <div style={{ color: 'red', padding: 16 }}>Error: {err}</div>;
  if (!data) return <div style={{ padding: 16 }}>No hay datos.</div>;

  const { order, items } = data;

  return (
    <div style={{ padding: 16 }}>
      <h2>Orden #{order.id}</h2>
      <div>Status: <b>{order.status}</b></div>
      <div>Cliente: {order.customer_name}</div>
      <div>Total: S/ {order.total_amount?.toFixed?.(2) ?? order.total_amount}</div>

      <h3 style={{ marginTop: 12 }}>Items</h3>
      <ul>
        {items.map(it => (
          <li key={it.id}>
            {it.name} x {it.qty} — S/ {(it.unit_price * it.qty).toFixed(2)}
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {order.status === 'awaiting_payment' && (
          <>
            <button onClick={() => pay('success')}>Pagar (simulado)</button>
            <button onClick={() => pay('failed')}>Fallar pago</button>
          </>
        )}
        <Link to="/">Volver al inicio</Link>
      </div>
    </div>
  );
}
