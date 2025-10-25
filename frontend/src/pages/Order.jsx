import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGetOrder, apiPayOrder } from '../services/api';
import './Order.css';



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

      if (result === 'success') {
        localStorage.setItem('trackOrderId', String(id));
      }
    } catch (e) {
      alert(String(e.message || e));
    }
  }


  if (loading) return <div style={{ padding: 16 }}>Cargando orden...</div>;
  if (err) return <div style={{ color: 'red', padding: 16 }}>Error: {err}</div>;
  if (!data) return <div style={{ padding: 16 }}>No hay datos.</div>;

  const { order, items } = data;

  const statusClass = `status-badge status-${(order.status || '').replace(/\s+/g, '_')}`;


  return (
    <div className="order-container">
      <h2 className="order-title">Orden #{order.id}</h2>

      <div className="order-header">
        <div className="order-meta">
          <div className="status-wrap">
            <span className="status-label">Estado:</span>
            <span className={statusClass}>{order.status}</span>
          </div>
          <div>Cliente: <b>{order.customer_name}</b></div>
        </div>

        <div className="order-total">
          Total: S/ {order.total_amount?.toFixed?.(2) ?? order.total_amount}
        </div>
      </div>

      <div className="items-block">
        <h3 className="items-title">Items</h3>
        <ul className="items-list">
          {items.map(it => (
            <li key={it.id}>
              <span>{it.name} x {it.qty}</span>
              <span>S/ {(it.unit_price * it.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="actions">
        {order.status === 'awaiting_payment' && (
          <>
            <button className="btn-primary" onClick={() => pay('success')}>Pagar (simulado)</button>
            <button className="btn-secondary" onClick={() => pay('failed')}>Fallar pago</button>
          </>
        )}
        <Link to="/productos" className="btn-secondary">Volver a productos</Link>
      </div>
    </div>
  );
}
