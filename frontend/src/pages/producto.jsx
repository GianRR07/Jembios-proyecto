import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Producto() {
  const [productos] = useState([
    {
      nombre: "Jeringa",
      imagen: "Jeringa.jpg",
      modelo: "Jeringa.glb",
      categoria: "Instrumento Medico",
      precio: 4.0,
      detalles: "Jeringa médica estéril de un solo uso.",
    },
    {
      nombre: "Estetoscopio",
      imagen: "Stethoscope.jpg",
      modelo: "Stethoscope.glb",
      categoria: "Instrumento Medico",
      precio: 12.0,
      detalles: "Estetoscopio profesional para auscultación.",
    },
    {
      nombre: "Bisturí",
      imagen: "bisturi.jpg",
      modelo: "bisturi.glb",
      categoria: "Instrumento Medico",
      precio: 3.5,
      detalles: "Bisturí quirúrgico de acero inoxidable.",
    },
    {
      nombre: "Soporte para Suero",
      imagen: "soporte.jpg",
      modelo: "soporte.glb",
      categoria: "Equipo Medico",
      precio: 25.0,
      detalles: "Soporte rodable para bolsas de suero.",
    },
    {
      nombre: "Microscopio Médico",
      imagen: "Microscope.jpg",
      modelo: "Microscope.glb",
      categoria: "Equipo Medico",
      precio: 320.0,
      detalles: "Microscopio profesional con aumento de hasta 1000x.",
    },
  ]);

  const [productosAprobados, setProductosAprobados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categorias, setCategorias] = useState({
    "Instrumento Medico": true,
    "Equipo Medico": true,
  });
  const [carrito, setCarrito] = useState([]);
  const [modalProducto, setModalProducto] = useState(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [toast, setToast] = useState("");
  const [direccion, setDireccion] = useState("");
  const [posicion, setPosicion] = useState(null);
  const [cargandoDireccion, setCargandoDireccion] = useState(false);

  // FILTRADO
  const filtrados = productos.filter(
    (p) =>
      categorias[p.categoria] &&
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Traer productos aprobados del backend
  useEffect(() => {
    fetch("http://localhost:5000/api/marketing/productos/aprobados")
      .then((res) => res.json())
      .then((data) => setProductosAprobados(data))
      .catch((err) => console.error(err));
  }, []);

  // TOAST AUTO-CIERRE
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // FUNCIONES
  const agregarCarrito = (p) => {
    setCarrito([...carrito, p]);
    setToast(`${p.nombre} añadido al carrito`);
  };

  const eliminarCarrito = (i) => {
    setCarrito(carrito.filter((_, idx) => idx !== i));
  };

  const total = carrito.reduce((acc, p) => acc + p.precio, 0);

  const pedirWhatsApp = (nombre) => {
    const num = "51999999999";
    const msg = `Hola, estoy interesado en el producto: ${nombre}`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const comprar = () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    if (!direccion) {
      alert("Por favor, selecciona o escribe tu dirección antes de comprar.");
      return;
    }

    const resumen = carrito
      .map((p) => `• ${p.nombre} - S/ ${p.precio.toFixed(2)}`)
      .join("\n");

    const mensaje = `Pedido desde Jembios 🏥\n\n${resumen}\n\nTotal: S/ ${total.toFixed(
      2
    )}\nDirección: ${direccion}`;

    sessionStorage.setItem("direccionPedido", direccion);
    setCarrito([]);
    setMostrarCarrito(false);
    window.location.href = "/seguimiento";
  };

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosicion([lat, lng]);
        setCargandoDireccion(true);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
        )
          .then((res) => res.json())
          .then((data) => {
            if (data && data.address) {
              const a = data.address;
              const texto = `${a.road || "Dirección sin nombre"} ${
                a.house_number || ""
              }, ${a.suburb || a.town || a.city || ""}, ${a.state || ""}`;
              setDireccion(texto.trim());
            } else {
              setDireccion(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
            }
          })
          .catch(() =>
            setDireccion(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`)
          )
          .finally(() => setCargandoDireccion(false));
      },
    });
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* TOPBAR */}
      <div className="bg-blue-100 text-gray-700 text-sm py-2 px-4 flex justify-between items-center flex-wrap">
        <div className="flex gap-3 items-center">
          <span>📧 jembios@hotmail.com</span>
          <span>📍 Lima — Carabayllo</span>
        </div>
        <div className="flex gap-3">
          <span>Facebook</span>
          <span>Instagram</span>
          <span>LinkedIn</span>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="flex flex-col md:flex-row gap-6 mt-6 px-4 max-w-7xl mx-auto">
        {/* SIDEBAR */}
        <aside className="md:w-64 w-full border rounded-lg bg-white p-4 shadow-sm">
          <input
            type="search"
            placeholder="Buscar productos..."
            className="border rounded px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <h3 className="font-semibold text-gray-700 mb-2">CATEGORÍAS</h3>
          {Object.keys(categorias).map((cat) => (
            <label key={cat} className="block text-sm text-gray-600 mb-1">
              <input
                type="checkbox"
                checked={categorias[cat]}
                onChange={() =>
                  setCategorias({ ...categorias, [cat]: !categorias[cat] })
                }
                className="mr-2"
              />
              {cat.toUpperCase()}
            </label>
          ))}
        </aside>

        {/* PRODUCTOS */}
        <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((p, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition"
            >
              <img
                src={p.imagen}
                alt={p.nombre}
                className="w-full h-48 object-contain rounded bg-gray-50"
              />
              <h3 className="text-lg font-semibold mt-3 text-gray-800">
                {p.nombre}
              </h3>
              <p className="text-blue-700 font-bold">S/ {p.precio.toFixed(2)}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => agregarCarrito(p)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Añadir
                </button>
                <button
                  onClick={() => pedirWhatsApp(p.nombre)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => setModalProducto(p)}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                >
                  Ver
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* NUEVA SECCIÓN: PRODUCTOS APROBADOS */}
      <div className="max-w-7xl mx-auto mt-12 px-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Productos Aprobados</h2>
        <div className="space-y-6">
          {productosAprobados.map((prod) => (
            <div key={prod.id_pendiente} className="bg-white p-4 rounded-xl shadow-md flex space-x-4 max-w-4xl border border-blue-200">
              <div className="flex-shrink-0">
                <img
                  src={`http://localhost:5000/uploads/${prod.imagen_url}`}
                  alt={prod.nombre}
                  className="w-48 h-48 object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-700">{prod.nombre}</h3>
                <p className="text-gray-600">{prod.principio_activo}</p>
                <p className="text-gray-800 mt-2">{prod.descripcion}</p>
                <p className="text-gray-700 mt-2">SKU: {prod.sku}</p>
                <p className="text-gray-700 mt-1">Precio: S/ {prod.precio}</p>
                <p className="text-gray-700 mt-1">Categoría: {prod.categoria}</p>
                {prod.certificado_url && (
                  <a
                    href={`http://localhost:5000/uploads/${prod.certificado_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                  >
                    Ver certificado
                  </a>
                )}
              </div>
            </div>
          ))}
          {productosAprobados.length === 0 && (
            <p className="text-gray-600">No hay productos aprobados aún</p>
          )}
        </div>
      </div>

      {/* MODAL PRODUCTO */}
      {modalProducto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[600px] relative p-4">
            <button
              onClick={() => setModalProducto(null)}
              className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            <model-viewer
              src={modalProducto.modelo}
              auto-rotate
              camera-controls
              style={{ width: "100%", height: "300px", background: "#e6f4ea" }}
            ></model-viewer>
            <h3 className="text-xl font-semibold mt-4">{modalProducto.nombre}</h3>
            <p className="text-gray-600 mt-1">{modalProducto.detalles}</p>
          </div>
        </div>
      )}

      {/* CARRITO */}
      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[95%] md:w-[650px] rounded-2xl p-6 shadow-2xl relative border-t-4 border-blue-600 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setMostrarCarrito(false)}
              className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-gray-700"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold text-blue-700 mb-4">
              Tu Carrito
            </h3>

            {carrito.length === 0 ? (
              <p className="text-gray-600">Tu carrito está vacío.</p>
            ) : (
              <ul className="divide-y mb-4">
                {carrito.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg px-2 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        className="w-14 h-14 object-contain bg-gray-100 rounded-md border"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{p.nombre}</p>
                        <p className="text-sm text-gray-500">
                          S/ {p.precio.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarCarrito(i)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-3 font-semibold text-lg text-gray-800">
              Total: <span className="text-blue-700">S/ {total.toFixed(2)}</span>
            </p>

            {/* DIRECCIÓN */}
            <div className="mt-5">
              <label className="font-medium text-gray-700">
                Añade tu dirección:
              </label>
              <input
                type="text"
                placeholder="Haz clic en el mapa o escribe tu dirección..."
                value={direccion || ""}
                onChange={(e) => setDireccion(e.target.value)}
                className="border border-blue-300 rounded-md w-full px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {cargandoDireccion && (
                <p className="text-sm text-gray-500 mt-1">
                  Buscando dirección...
                </p>
              )}
            </div>

            {/* MAPA */}
            <div className="mt-4 h-64 rounded-lg overflow-hidden border border-blue-200">
              <MapContainer
                center={[-12.0464, -77.0428]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <MapClickHandler />
                {posicion && <Marker position={posicion} icon={markerIcon} />}
              </MapContainer>
            </div>

            <button
              onClick={comprar}
              className="mt-5 w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Comprar ahora
            </button>
          </div>
        </div>
      )}

      {/* BOTÓN CARRITO */}
      <button
        onClick={() => setMostrarCarrito(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 font-semibold"
      >
        Carrito ({carrito.length})
      </button>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
