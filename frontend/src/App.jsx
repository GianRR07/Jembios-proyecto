import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./componentes/Navbar";
import Producto from "./pages/producto";
import Seguimiento from "./pages/seguimiento";
import Login from "./pages/login";
import Admin from "./pages/Admin";
import Marketing from "./pages/Marketing";

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem("usuario");
    return stored ? JSON.parse(stored) : null;
  });

  // 🔹 Función para login/logout compartida
  const handleLogin = (userData) => {
    localStorage.setItem("usuario", JSON.stringify(userData));
    setUsuario(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  // 🔹 Redirección según rol (opcional)
  const redirectByRole = () => {
    if (!usuario) return <Navigate to="/login" replace />;
    const rol = usuario.usuario?.id_rol;
    if (rol === 1) return <Navigate to="/admin" replace />;
    if (rol === 2) return <Navigate to="/marketing" replace />;
    return <Navigate to="/producto" replace />;
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* === NAVBAR === */}
        <Navbar usuario={usuario} onLogout={handleLogout} />

        {/* === CONTENIDO PRINCIPAL === */}
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
                    Usa el menú superior para navegar entre secciones.
                  </p>
                </div>
              }
            />
            <Route path="/producto" element={<Producto />} />
            <Route path="/seguimiento" element={<Seguimiento />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/redirect" element={redirectByRole()} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
