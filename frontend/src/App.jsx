import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Producto from './pages/producto'
import Seguimiento from './pages/seguimiento'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white shadow-sm p-4">
          <nav className="container mx-auto flex gap-4">
            <Link to="/" className="font-bold text-blue-600 hover:underline">
              Jembios
            </Link>
            <Link to="/producto" className="text-gray-700 hover:text-blue-600">
              Producto
            </Link>
            <Link to="/seguimiento" className="text-gray-700 hover:text-blue-600">
              Seguimiento
            </Link>
          </nav>
        </header>

        <main className="flex-1 container mx-auto p-6">
          <Routes>
            <Route
              path="/"
              element={
                <div className="text-center mt-10">
                  <h1 className="text-3xl font-semibold text-blue-700">
                    Bienvenido a <span className="font-bold">Jembios</span>
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Usa el menú superior para visitar las páginas convertidas.
                  </p>
                </div>
              }
            />
            <Route path="/producto" element={<Producto />} />
            <Route path="/seguimiento" element={<Seguimiento />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
