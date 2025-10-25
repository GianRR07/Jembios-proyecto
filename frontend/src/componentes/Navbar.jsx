import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ usuario, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Jembios
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/producto" className="hover:text-gray-200">
            Productos
          </Link>
          <Link to="/seguimiento" className="hover:text-gray-200">
            Seguimiento
          </Link>

          {usuario ? (
            <>
              {/* Mostrar según rol */}
              {usuario.usuario?.id_rol === 1 && (
                <Link to="/admin" className="hover:text-gray-200">
                  Admin
                </Link>
              )}
              {usuario.usuario?.id_rol === 2 && (
                <Link to="/marketing" className="hover:text-gray-200">
                  Marketing
                </Link>
              )}

              <button
                onClick={handleLogoutClick}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-blue-700 px-3 py-1 rounded-md hover:bg-gray-100"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
