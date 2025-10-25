// frontend/src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../store/cart.jsx';   // 👈 nuevo
import { useEffect, useState } from 'react'; // 👈 nuevo
import './Header.css';

export default function Header() {
  const { pathname } = useLocation();
  const { items } = useCart();                 // 👈 nuevo
  const count = items.reduce((a, it) => a + it.qty, 0); // 👈 nuevo

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/nosotros', label: 'Nosotros' },
    { path: '/ventas', label: 'Productos' },
    { path: '/facturas', label: 'Servicios' },
    { path: '/catalogos', label: 'Catálogos' },
    { path: '/contacto', label: 'Contacto' },
  ];

  const [trackId, setTrackId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('trackOrderId');
    setTrackId(id ? Number(id) : null);
  }, [pathname]);

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <span>jembios@hotmail.com</span>
          <span>Mza. V Lote. 4 Int. 202 A.H. Juan Pablo II, Lima – Carabayllo</span>
        </div>
      </div>

      <div className="header-main">
        <div className="container header-content">
          <div className="logo">
            <img src="/logo-jembios.png" alt="Jembios" />
          </div>

          <nav className="nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="actions">
            {/* Botón Informes (ya estaba) */}
            <button className="btn-informes">INFORMES</button>

            {/* 👇 Nuevo: botón Carrito con contador */}
            <Link to="/cart" className="cart-btn" aria-label="Ver carrito">
              {/* SVG carrito simple, sin dependencias */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.41A1 1 0 0 0 9 20h10v-2H9.42l.93-1.66h7.72a1 1 0 0 0 .92-.62L22 8H6.42l-.72-2H7V4z" fill="currentColor" />
              </svg>
              <span className="cart-text">Carrito</span>
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
            {trackId && (
                <Link to={`/tracking/${trackId}`} className="btn-informes" style={{ background: '#28a745' }}>
                  Seguimiento
                </Link>
              )}
          </div>
        </div>
      </div>
    </header>
  );
}
