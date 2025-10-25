import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import Home from './pages/Home.jsx'
import Ventas from './ventas/index.jsx'
import Facturas from './facturas/index.jsx'
import Marketing from './marketing/index.jsx'

function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: 12, padding: 12 }}>
        <Link to="/">Inicio</Link>
        <Link to="/ventas">Ventas</Link>
        <Link to="/facturas">Facturas</Link>
        <Link to="/marketing">Marketing</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/facturas" element={<Facturas />} />
        <Route path="/marketing" element={<Marketing />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
