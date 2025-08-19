// Header.jsx
import { useAuth } from "../context/AuthContext";
import { Sun, User, X, Menu } from "lucide-react"; // ✅ Importado X

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user } = useAuth();
  const { nombre, apellido, rol } = user;

  return (
    <header className="bg-white shadow-md px-4 py-4 flex justify-between items-center sticky top-0 z-10">
      {/* Botón para abrir/cerrar sidebar en móvil */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />} {/* Usa X */}
      </button>

      <div className="flex-1 md:ml-4">
        <h1 className="text-xl font-bold text-gray-800">Bienvenido 👋</h1>
        <p className="text-gray-500 text-sm">
          {nombre} {apellido} | <span className="capitalize">{rol.toLowerCase()}</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="hover:bg-gray-100 p-2 rounded-full transition">
          <Sun className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700 capitalize">
            {rol === "EX_INTERNO" ? "Ex Interno" : rol.toLowerCase()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;