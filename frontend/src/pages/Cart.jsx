import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../store/cart.jsx';
import { apiQuoteShipping, apiValidateCoupon } from '../services/api';

const DISTRICTS = ['Lima Centro','Lima Norte','Lima Sur','Lima Este'];

export default function CartPage() {
  const nav = useNavigate();
  const { items, setQty, remove, subtotal } = useCart();

  const [district, setDistrict] = useState('Lima Centro');
  const [ship, setShip] = useState(null);
  const [shipErr, setShipErr] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponInfo, setCouponInfo] = useState(null);
  const [couponErr, setCouponErr] = useState('');

  const amountBeforeDiscount = useMemo(() => subtotal + (ship?.cost || 0), [subtotal, ship]);
  const discount = couponInfo?.discount ? Number(couponInfo.discount) : 0;
  const total = Math.max(0, amountBeforeDiscount - discount);

  async function quote() {
    setShipErr('');
    try {
      const payload = {
        district,
        items: items.map(it => ({ productId: it.product.id, qty: it.qty })),
      };
      const q = await apiQuoteShipping(payload);
      setShip(q);
    } catch (e) {
      setShipErr(String(e.message || e));
      setShip(null);
    }
  }

  async function applyCoupon() {
    setCouponErr('');
    setCouponInfo(null);
    if (!coupon) return;

    try {
      const v = await apiValidateCoupon({ code: coupon, amount: subtotal });
      if (!v.valid) {
        setCouponErr(`Cupón inválido: ${v.reason || 'desconocido'}`);
      } else {
        setCouponInfo(v);
      }
    } catch (e) {
      setCouponErr(String(e.message || e));
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: 16 }}>
        <div>Tu carrito está vacío.</div>
        <Link to="/">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Carrito</h2>

      <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
        <thead>
          <tr><th style={{ textAlign: 'left' }}>Producto</th><th>Cantidad</th><th>Precio</th><th></th></tr>
        </thead>
        <tbody>
          {items.map(({ product, qty }) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>
                <input type="number" min="1" value={qty}
                  onChange={(e) => setQty(product.id, Number(e.target.value))}
                  style={{ width: 60 }} />
              </td>
              <td>S/ {(product.price * qty).toFixed(2)}</td>
              <td><button onClick={() => remove(product.id)}>Quitar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12 }}>
        <b>Subtotal:</b> S/ {subtotal.toFixed(2)}
      </div>

      <hr style={{ margin: '12px 0' }} />

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <label>Distrito:</label>
        <select value={district} onChange={(e) => setDistrict(e.target.value)}>
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button onClick={quote}>Cotizar envío</button>
        {shipErr && <span style={{ color: 'red' }}>{shipErr}</span>}
      </div>
      {ship && (
        <div style={{ marginTop: 8 }}>
          <b>Envío:</b> S/ {ship.cost.toFixed(2)} (peso total: {ship.totalWeight.toFixed(2)} kg)
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <input placeholder="Cupón (opcional)" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
        <button onClick={applyCoupon} style={{ marginLeft: 8 }}>Aplicar</button>
        {couponErr && <div style={{ color: 'red' }}>{couponErr}</div>}
        {couponInfo?.valid && <div style={{ color: 'green' }}>Descuento: S/ {couponInfo.discount.toFixed(2)}</div>}
      </div>

      <div style={{ marginTop: 12 }}>
        <b>Total:</b> S/ {total.toFixed(2)}
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={() => nav('/checkout', { state: { district, ship, coupon: couponInfo } })}>
          Continuar al checkout
        </button>
      </div>
    </div>
  );
}
