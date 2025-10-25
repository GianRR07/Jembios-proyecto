// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import { getJson, patchJson, http } from "../services/http";
import "../styles/admin.css";

export default function Admin() {
  const [pendientes, setPendientes] = useState([]);
  const [toast, setToast] = useState("");

  const fetchPendientes = async () => {
    try {
      const res = await getJson("/api/marketing/productos/pendientes");
      setPendientes(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchPendientes(); }, []);

  const aprobarProducto = async (id) => {
    try {
      await patchJson(`/api/marketing/productos/${id}/aprobar`, {});
      setToast("Producto aprobado correctamente");
      fetchPendientes();
    } catch (err) {
      console.error(err);
      setToast("Error al aprobar el producto");
    }
  };

  const rechazarProducto = async (id) => {
    try {
      await patchJson(`/api/marketing/productos/${id}/rechazar`, {});
      setToast("Producto rechazado correctamente");
      fetchPendientes();
    } catch (err) {
      console.error(err);
      setToast("Error al rechazar el producto");
    }
  };


  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const uploadsBase = `${http.defaults.baseURL}/uploads/`;

  return (
    <div className="admin-wrap">
      {/* Sidebar */}
      <aside className="admin-side">
        <h2>Administrador</h2>
        <button className="side-btn">Productos para alta</button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <h1 className="admin-title">Productos Pendientes</h1>

        {pendientes.length === 0 ? (
          <p style={{ color: "#4b5563" }}>No hay productos pendientes.</p>
        ) : (
          <div className="admin-grid">
            {pendientes.map((p) => (
              <div key={p.id_pendiente} className="admin-card">
                <h3>{p.nombre}</h3>
                <div className="admin-meta">
                  <p><strong>Principio activo:</strong> {p.principio_activo || "-"}</p>
                  <p><strong>Descripción:</strong> {p.descripcion || "-"}</p>
                  <p><strong>SKU:</strong> {p.sku || "-"}</p>
                  <p><strong>Categoría:</strong> {p.categoria}</p>
                  <p className="admin-price"><strong>Precio:</strong> S/ {Number(p.precio).toFixed(2)}</p>
                </div>

                {p.imagen_url && (
                  <img
                    src={`${uploadsBase}${p.imagen_url}`}
                    alt={p.nombre}
                    className="admin-img"
                  />
                )}
                {p.certificado_url && (
                  <a
                    href={`${uploadsBase}${p.certificado_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#2563eb", textDecoration: "underline" }}
                  >
                    Ver certificado
                  </a>
                )}

                <div className="admin-actions">
                  <button className="btn-approve" onClick={() => aprobarProducto(p.id_pendiente)}>
                    Aprobar
                  </button>

                  <button className="btn-reject" onClick={() => rechazarProducto(p.id_pendiente)}>
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
