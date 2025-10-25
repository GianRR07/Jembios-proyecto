// src/pages/login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postJson } from "../services/http";
import "../styles/auth.css";

export default function Login({ onLogin }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "nombre") setNombre(value);
    if (name === "correo") setCorreo(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const url = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { correo, password }
        : { nombre, correo, password, rol: "Cliente" };

      const data = await postJson(url, payload);
      const usuario = data.usuario || data;

      if (isLogin) {
        localStorage.setItem("usuario", JSON.stringify(usuario));
        onLogin?.(usuario);
        setMensaje("✅ Inicio de sesión exitoso");
        setTimeout(() => {
          if (usuario.rol === "Administrador") navigate("/admin");
          else if (usuario.rol === "Marketing") navigate("/marketing");
          else navigate("/producto");
        }, 600);
      } else {
        setMensaje("✅ Registro exitoso, ahora inicia sesión");
        setIsLogin(true);
      }
    } catch (error) {
      setMensaje(
        error?.response?.data?.error ||
        error?.message ||
        "❌ Error en la conexión o datos incorrectos"
      );
    }
  };

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    if (usuario) {
      if (usuario.rol === "Administrador") navigate("/admin");
      else if (usuario.rol === "Marketing") navigate("/marketing");
      else navigate("/producto");
    }
  }, [navigate]);

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        {/* FORM */}
        <div className="auth-form">
          <h2 className="auth-title">{isLogin ? "Iniciar sesión" : "Registrarse"}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="auth-label">Nombre:</label>
                <input
                  className="auth-input"
                  type="text"
                  name="nombre"
                  value={nombre}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  required
                />
              </div>
            )}
            <div>
              <label className="auth-label">Correo electrónico:</label>
              <input
                className="auth-input"
                type="email"
                name="correo"
                value={correo}
                onChange={handleInputChange}
                placeholder="Ej: usuario@gmail.com"
                required
              />
            </div>
            <div>
              <label className="auth-label">Contraseña:</label>
              <input
                className="auth-input"
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="auth-btn">
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
            className="auth-switch"
          >
            {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>

          {mensaje && <div className="auth-msg">{mensaje}</div>}
        </div>

        {/* HERO */}
        <div className="auth-hero">
          <h2>¡Bienvenido a Jembios!</h2>
          <p>
            Tu farmacia digital de confianza 💊. Encuentra tus productos médicos y
            controla tus pedidos fácilmente.
          </p>
        </div>
      </div>
    </div>
  );
}
