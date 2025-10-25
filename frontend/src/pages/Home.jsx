import { useEffect, useState } from 'react';
import { apiGetProducts } from '../services/api';
import { useCart } from '../store/cart.jsx';
import { Link } from 'react-router-dom';

export default function Home() {
  const { add } = useCart();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGetProducts();
        setRows(data);
      } catch (e) {
        setError(String(e.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Cargando catálogo...</div>;
  if (error) return <div style={{ color: 'red', padding: 16 }}>Error: {error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Catálogo</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {rows.map((p) => (
          <div key={p.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
            <b>{p.name}</b> <small>({p.category})</small>
            <div>S/ {p.price.toFixed(2)}</div>
            <div>Stock: {p.stock}</div>
            <button onClick={() => add(p, 1)} disabled={p.stock <= 0} style={{ marginTop: 8 }}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <Link to="/cart">Ir al carrito →</Link>
      </div>
    </div>
  );
}
