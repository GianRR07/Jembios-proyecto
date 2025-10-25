import { useState, useEffect } from "react";
import axios from "axios";

export default function Admin() {
  const [pendientes, setPendientes] = useState([]);
  const [toast, setToast] = useState("");

  // === Cargar productos pendientes ===
  const fetchPendientes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/marketing/productos/pendientes"
      );
      setPendientes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendientes();
  }, []);

  // === Aprobar producto ===
  const aprobarProducto = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/marketing/productos/aprobar/${id}`);
      setToast("Producto aprobado correctamente");
      fetchPendientes();
    } catch (err) {
      console.error(err);
      setToast("Error al aprobar el producto");
    }
  };

  // === Rechazar producto ===
  const rechazarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/marketing/productos/rechazar/${id}`);
      setToast("Producto rechazado correctamente");
      fetchPendientes();
    } catch (err) {
      console.error(err);
      setToast("Error al rechazar el producto");
    }
  };

  // === Toast auto cierre ===
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Barra lateral */}
      <aside className="w-64 bg-blue-700 text-white p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold mb-4">Administrador</h2>
        <button className="py-2 px-4 rounded hover:bg-blue-600 transition">
          Productos para alta
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Productos Pendientes</h1>
        {pendientes.length === 0 ? (
          <p className="text-gray-600">No hay productos pendientes.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendientes.map((p) => (
              <div
                key={p.id_pendiente}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3"
              >
                <h3 className="text-xl font-semibold">{p.nombre}</h3>
                <p><strong>Principio activo:</strong> {p.principio_activo}</p>
                <p><strong>Descripción:</strong> {p.descripcion}</p>
                <p><strong>SKU:</strong> {p.sku}</p>
                <p><strong>Categoría:</strong> {p.categoria}</p>
                <p><strong>Precio:</strong> S/ {p.precio.toFixed(2)}</p>
                {p.imagen_url && (
                  <img
                    src={`http://localhost:5000/uploads/${p.imagen_url}`}
                    alt={p.nombre}
                    className="w-full h-48 object-contain rounded"
                  />
                )}
                {p.certificado_url && (
                  <a
                    href={`http://localhost:5000/uploads/${p.certificado_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Ver certificado
                  </a>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => aprobarProducto(p.id_pendiente)}
                    className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => rechazarProducto(p.id_pendiente)}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
