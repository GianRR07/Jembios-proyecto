import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import { CartProvider } from './store/cart.jsx'
import Home from './pages/Home.jsx'
import Ventas from './ventas/index.jsx'
import Facturas from './facturas/index.jsx'
import Marketing from './marketing/index.jsx'

// nuevas páginas:
import CartPage from './pages/Cart.jsx'
import CheckoutPage from './pages/Checkout.jsx'
import OrderPage from './pages/Order.jsx'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ddd' }}>
          <Link to="/">Inicio</Link>
          <Link to="/ventas">Ventas</Link>
          <Link to="/facturas">Facturas</Link>
          <Link to="/marketing">Marketing</Link>
          <Link to="/cart">Carrito</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderPage />} />
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
