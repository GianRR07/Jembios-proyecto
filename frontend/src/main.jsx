import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import { CartProvider } from './store/cart.jsx'
import Home from './pages/Home.jsx'
import Ventas from './ventas/index.jsx'
import Facturas from './facturas/index.jsx'
import Marketing from './marketing/index.jsx'
import Header from './components/Header.jsx'


// nuevas páginas:
import CartPage from './pages/Cart.jsx'
import CheckoutPage from './pages/Checkout.jsx'
import OrderPage from './pages/Order.jsx'
import TrackingPage from './pages/Tracking.jsx';


function App() {
  return (
    <CartProvider>

      <BrowserRouter>
      <Header />
        
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="/tracking/:id" element={<TrackingPage />} />

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
