import { useState } from "react";

export default function Marketing() {
  const [selectedTab, setSelectedTab] = useState("inicio");
  const [formData, setFormData] = useState({
    nombre: "",
    principioActivo: "",
    descripcion: "",
    sku: "",
    precio: "",
    categoria: "",
    imagenes: null,
    certificados: null,
  });
  const [status, setStatus] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagenes" && files && files[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === "certificados" && files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("principioActivo", formData.principioActivo);
    data.append("descripcion", formData.descripcion);
    data.append("sku", formData.sku);
    data.append("precio", formData.precio);
    data.append("categoria", formData.categoria);
    if (formData.imagenes) data.append("imagen", formData.imagenes);
    if (formData.certificados) data.append("certificado", formData.certificados);

    try {
      const response = await fetch(
        "http://localhost:5000/api/marketing/productos/pendientes",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await response.json();
      if (result.ok) {
        setStatus("✅ Producto enviado a Administración correctamente");
        // Limpiar formulario
        setFormData({
          nombre: "",
          principioActivo: "",
          descripcion: "",
          sku: "",
          precio: "",
          categoria: "",
          imagenes: null,
          certificados: null,
        });
        setPreviewImage(null);
      } else {
        setStatus("❌ Error: " + (result.error || "Desconocido"));
      }
    } catch (err) {
      setStatus("❌ Error al enviar: " + err.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-green-100 p-6">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Marketing</h2>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => setSelectedTab("inicio")}
              className={`w-full text-left px-4 py-2 rounded ${
                selectedTab === "inicio"
                  ? "bg-green-500 text-white"
                  : "hover:bg-green-200"
              }`}
            >
              Inicio
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedTab("formulario")}
              className={`w-full text-left px-4 py-2 rounded ${
                selectedTab === "formulario"
                  ? "bg-green-500 text-white"
                  : "hover:bg-green-200"
              }`}
            >
              Formulario de Producto
            </button>
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-8 bg-gray-50">
        {selectedTab === "inicio" && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-700">
              Panel de Marketing
            </h1>
            <p className="mt-2 text-gray-600">
              Aquí puedes gestionar campañas y promociones.
            </p>
          </div>
        )}

        {selectedTab === "formulario" && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold text-green-700 mb-6">
              Alta de Producto
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre comercial"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="principioActivo"
                value={formData.principioActivo}
                onChange={handleChange}
                placeholder="Principio activo / fórmula"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción técnica"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Código SKU / interno"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="Precio sugerido"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="">Selecciona categoría</option>
                <option value="medicamento">Medicamento</option>
                <option value="suplemento">Suplemento</option>
                <option value="cosmetico">Cosmético</option>
              </select>

              <div className="text-center mt-4">
                <input
                  type="file"
                  name="imagenes"
                  id="imagenes"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="imagenes"
                  className="inline-block bg-green-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-green-700"
                >
                  {formData.imagenes
                    ? "Imagen seleccionada: " + formData.imagenes.name
                    : "Subir imágenes"}
                </label>

                {previewImage && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-64 h-64 object-cover border rounded"
                    />
                  </div>
                )}
              </div>

              <div className="text-center mt-4">
                <input
                  type="file"
                  name="certificados"
                  id="certificados"
                  onChange={handleChange}
                  accept="application/pdf"
                  className="hidden"
                />
                <label
                  htmlFor="certificados"
                  className="inline-block bg-green-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-green-700"
                >
                  {formData.certificados
                    ? "Archivo PDF: " + formData.certificados.name
                    : "Subir certificados PDF"}
                </label>

                {formData.certificados && (
                  <div className="mt-2 flex justify-center">
                    <a
                      href={URL.createObjectURL(formData.certificados)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-gray-100 px-4 py-2 rounded shadow hover:bg-gray-200"
                    >
                      <span className="material-icons mr-2 text-gray-600">
                        picture_as_pdf
                      </span>
                      <span>{formData.certificados.name}</span>
                    </a>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4"
              >
                Enviar a Administración
              </button>
            </form>

            {status && (
              <p className="mt-4 text-yellow-700 font-medium">{status}</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
