import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // 🔹 Manejo de campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "nombre") setNombre(value);
    if (name === "correo") setCorreo(value);
    if (name === "password") setPassword(value);
  };

  // 🔹 Envío de formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const data = isLogin
        ? { correo, password }
        : { nombre, correo, password, id_rol: 3 }; // 3 = Cliente

      const res = await axios.post(url, data);

      if (res.status === 200) {
        const usuario = res.data.usuario || res.data;

        if (isLogin) {
          // 🔹 Guardar sesión y actualizar App.jsx
          localStorage.setItem("usuario", JSON.stringify(usuario));
          onLogin(usuario); // 🔥 Actualiza el navbar sin F5
          setMensaje("✅ Inicio de sesión exitoso");

          // 🔹 Redirección según rol
          setTimeout(() => {
            if (usuario.id_rol === 1) navigate("/admin");
            else if (usuario.id_rol === 2) navigate("/marketing");
            else navigate("/producto");
          }, 800);
        } else {
          setMensaje("✅ Registro exitoso, ahora inicia sesión");
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error("Error en login/register:", error);
      setMensaje(
        error.response?.data?.error ||
          "❌ Error en la conexión o datos incorrectos"
      );
    }
  };

  // 🔹 Auto-redirección si ya está logueado
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
      if (usuario.id_rol === 1) navigate("/admin");
      else if (usuario.id_rol === 2) navigate("/marketing");
      else navigate("/producto");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden md:flex">
        {/* === FORMULARIO === */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">
            {isLogin ? "Iniciar sesión" : "Registrarse"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Nombre:
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={nombre}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Correo electrónico:
              </label>
              <input
                type="email"
                name="correo"
                value={correo}
                onChange={handleInputChange}
                placeholder="Ej: usuario@gmail.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Contraseña:
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {isLogin ? "Iniciar sesión" : "Registrar"}
            </button>
          </form>

          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMensaje("");
              setNombre("");
              setCorreo("");
              setPassword("");
            }}
            className="mt-4 text-sm text-blue-600 hover:underline focus:outline-none"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>

          {mensaje && (
            <div className="mt-4 p-3 rounded bg-blue-100 text-blue-700 font-medium text-center">
              {mensaje}
            </div>
          )}
        </div>

        {/* === PANEL DERECHO === */}
        <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-8 md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">¡Bienvenido a Jembios!</h2>
          <p className="text-lg leading-relaxed">
            Tu farmacia digital de confianza 💊.  
            Encuentra tus productos médicos y controla tus pedidos fácilmente.
          </p>
        </div>
      </div>
    </div>
  );
}
