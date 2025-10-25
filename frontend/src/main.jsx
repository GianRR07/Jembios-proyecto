import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'

import { CartProvider } from './store/cart.jsx'
import Home from './pages/Home.jsx'
import Ventas from './ventas/index.jsx'
import Facturas from './facturas/index.jsx'
import Header from './components/Header.jsx'

// nuevas páginas existentes
import CartPage from './pages/Cart.jsx'
import CheckoutPage from './pages/Checkout.jsx'
import OrderPage from './pages/Order.jsx'
import TrackingPage from './pages/Tracking.jsx'

// NUEVO: páginas del login/admin/marketing del compañero
import Login from './pages/login.jsx'              // NUEVO
import Admin from './pages/Admin.jsx'              // NUEVO
import MarketingPage from './pages/Marketing.jsx'  // NUEVO (usaremos esta en lugar de ./marketing/index.jsx)

// === NUEVO: wrapper de protección por rol ===
function RequireAuth({ children, roles }) {
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')
  if (!usuario) return <Navigate to="/login" replace />
  // roles puede ser string o array
  const allow = Array.isArray(roles) ? roles : [roles]
  if (roles && !allow.includes(usuario.rol)) return <Navigate to="/" replace />
  return children
}

function App() {
  // NUEVO: callback para que login.jsx pueda guardar sesión
  const handleLogin = (u) => {
    localStorage.setItem('usuario', JSON.stringify(u))
    // redirección opcional aquí (el propio login.jsx ya redirige por rol)
  }

  return (
    <CartProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          {/* Rutas públicas que ya tenías */}
          <Route path="/" element={<Ventas />} />
          <Route path="/productos" element={<Home />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="/tracking/:id" element={<TrackingPage />} />

          {/* NUEVO: login */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* NUEVO: rutas protegidas por rol */}
          <Route
            path="/admin"
            element={
              <RequireAuth roles="Administrador">
                <Admin />
              </RequireAuth>
            }
          />
          <Route
            path="/marketing"
            element={
              // Si quieres que Admin también pueda entrar a Marketing, deja ambos roles:
              <RequireAuth roles={['Marketing', 'Administrador']}>
                <MarketingPage />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
