import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🏥 Icono farmacia (origen)
const iconoFarmacia = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966486.png",
  iconSize: [38, 38],
});

// 📦 Icono paquete (movimiento)
const iconoPaquete = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1040/1040238.png",
  iconSize: [35, 35],
});

// Hace que el mapa siga al paquete
function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 14, { duration: 1.5 });
  }, [position]);
  return null;
}

export default function Seguimiento() {
  const [direccion, setDireccion] = useState("");
  const [estado, setEstado] = useState("Empaquetando");
  const [origen] = useState({ lat: -11.82737, lng: -77.07029 }); // 📍 Jembios Carabayllo
  const [destino, setDestino] = useState(null);
  const [trayectoria, setTrayectoria] = useState([]); // línea completa
  const [posicionPaquete, setPosicionPaquete] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const dir =
      sessionStorage.getItem("direccionPedido") ||
      new URLSearchParams(window.location.search).get("direccion") ||
      "";

    if (dir) setDireccion(dir);

    // Simula el empaquetado
    const timer = setTimeout(() => {
      if (dir) {
        setEstado("En camino");
        geocodificarDireccion(dir);
      } else {
        setEstado("Sin dirección");
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  // Geocodificar la dirección
  const geocodificarDireccion = async (dir) => {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dir)}`
      );
      const data = await resp.json();
      if (data && data.length > 0) {
        const destinoCoords = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
        setDestino(destinoCoords);
        calcularRuta(origen, destinoCoords);
      } else {
        alert("No se pudo encontrar la dirección.");
      }
    } catch (error) {
      console.error("Error al geocodificar:", error);
    }
  };

  // 🔵 Generar la ruta completa (línea estable)
  const calcularRuta = (inicio, fin) => {
    const pasos = 100;
    const puntos = [];
    for (let i = 0; i <= pasos; i++) {
      const lat = inicio.lat + ((fin.lat - inicio.lat) * i) / pasos;
      const lng = inicio.lng + ((fin.lng - inicio.lng) * i) / pasos;
      puntos.push([lat, lng]);
    }
    setTrayectoria(puntos);
    animarEntrega(puntos);
  };

  // 📦 Mover el paquete sin tocar la línea
  const animarEntrega = (puntos) => {
    let i = 0;
    const mover = setInterval(() => {
      setPosicionPaquete({ lat: puntos[i][0], lng: puntos[i][1] });
      i++;
      if (i >= puntos.length) {
        clearInterval(mover);
        setEstado("Entregado ✅");
        setMostrarConfirmacion(true);
      }
    }, 300);
  };

  const confirmarRecepcion = () => {
    setMensaje("✅ ¡Gracias por tu compra!\nRedirigiéndote a la página de productos...");
    redirigir("/producto");
  };

  const noRecibido = () => {
    setMensaje("⚠️ Si hubo algún problema, contáctanos por WhatsApp.\nRedirigiéndote...");
    redirigir("https://wa.me/51999999999");
  };

  const redirigir = (url) => {
    let segundos = 5;
    const intervalo = setInterval(() => {
      setMensaje((m) => `${m.split("\n")[0]}\nSerás redirigido en ${segundos} segundos...`);
      segundos--;
      if (segundos <= 0) {
        clearInterval(intervalo);
        window.location.href = url;
      }
    }, 1000);
  };

  if (estado === "Empaquetando") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-solid mb-6"></div>
        <h1 className="text-2xl font-semibold text-blue-700 mb-2">
          Tu pedido se está empaquetando 🧴
        </h1>
        <p className="text-gray-600">Por favor, espera unos segundos...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">
        {estado === "Entregado ✅"
          ? "✅ Pedido entregado"
          : "🚚 Tu pedido está en camino"}
      </h1>
      <p className="text-gray-600 mb-4">{direccion}</p>

      <div className="w-full h-[70vh] rounded-2xl overflow-hidden shadow-xl border-2 border-blue-300 max-w-4xl bg-white">
        <MapContainer
          center={[origen.lat, origen.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />

          {/* Marcadores */}
          <Marker position={[origen.lat, origen.lng]} icon={iconoFarmacia} />
          {destino && <Marker position={destino} icon={iconoPaquete} />}

          {/* 🔵 Línea azul estable */}
          {trayectoria.length > 1 && (
            <Polyline positions={trayectoria} color="#2563EB" weight={5} />
          )}

          {/* 📦 Paquete moviéndose */}
          {posicionPaquete && (
            <>
              <Marker position={posicionPaquete} icon={iconoPaquete} />
              <FlyTo position={posicionPaquete} />
            </>
          )}
        </MapContainer>
      </div>

      {/* Confirmación final */}
      {mostrarConfirmacion && (
        <div className="mt-6 bg-white rounded-2xl shadow-md p-6 text-center max-w-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">
            ¿Confirmas que recibiste tu pedido?
          </h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={confirmarRecepcion}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Sí, lo recibí
            </button>
            <button
              onClick={noRecibido}
              className="border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              No, hubo un problema
            </button>
          </div>
        </div>
      )}

      {mensaje && (
        <div className="mt-6 text-gray-700 whitespace-pre-line text-center bg-white p-4 rounded-xl shadow max-w-md border border-blue-200">
          {mensaje}
        </div>
      )}
    </div>
  );
}
