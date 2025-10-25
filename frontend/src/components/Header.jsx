// frontend/src/components/Header.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../store/cart.jsx';
import { useEffect, useState } from 'react';
import './Header.css';

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();                  // 👈 NUEVO
  const { items } = useCart();
  const count = items.reduce((a, it) => a + it.qty, 0);

  // 👇 NUEVO: usuario desde localStorage y logout
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/nosotros', label: 'Nosotros' },
    { path: '/productos', label: 'Productos' },
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

            {/* 👇 NUEVO: enlaces por rol en la barra principal (opcionales) */}
            {usuario?.rol === 'Administrador' && (
              <Link
                to="/admin"
                className={`nav-link ${pathname === '/admin' ? 'active' : ''}`}
              >
                Admin
              </Link>
            )}
            {usuario?.rol === 'Marketing' && (
              <Link
                to="/marketing"
                className={`nav-link ${pathname === '/marketing' ? 'active' : ''}`}
              >
                Marketing
              </Link>
            )}
          </nav>

          <div className="actions">
            {/* Botón Informes (ya estaba) */}
            <button className="btn-informes">INFORMES</button>

            {/* Botón Carrito con contador */}
            <Link to="/cart" className="cart-btn" aria-label="Ver carrito">
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

            {/* 👇 NUEVO: Login / Logout a la derecha */}
            {!usuario ? (
              <Link
                to="/login"
                className="btn-informes"
                style={{ background: '#ffffff', color: '#1e3a8a', border: '1px solid #1e3a8a' }}
              >
                Iniciar sesión
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="btn-informes"
                style={{ background: '#ffffff', color: '#1e3a8a', border: '1px solid #1e3a8a' }}
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
