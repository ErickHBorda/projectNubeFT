import { useAuth } from "../context/AuthContext";
import { Outlet, NavLink } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";

const Dashboard = () => {
  const { user } = useAuth();
  const { rol } = user;
  const [sidebarOpen, setSidebarOpen] = useState(true); // visible en desktop

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-white hover:bg-blue-700"
    }`;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-30 w-72 bg-blue-800 shadow-2xl p-6 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-white">Panel</h2>
            <button
              onClick={toggleSidebar}
              className="md:hidden text-white"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {rol === "ADMIN" && (
              <>
                <NavLink to="/dashboard/internos" className={linkStyle}>
                  👮 Internos
                </NavLink>
                <NavLink to="/dashboard/ex-internos" className={linkStyle}>
                  👤 Ex Internos
                </NavLink>
                <NavLink to="/dashboard/programas" className={linkStyle}>
                  📘 Programas
                </NavLink>
                <NavLink to="/dashboard/inscripciones" className={linkStyle}>
                  📝 Inscripciones
                </NavLink>
                <NavLink to="/dashboard/denuncias" className={linkStyle}>
                  📢 Denuncias
                </NavLink>
                <NavLink to="/dashboard/reportes" className={linkStyle}>
                  📊 Reportes
                </NavLink>
              </>
            )}

            {rol === "DOCENTE" && (
              <NavLink to="/dashboard/programas" className={linkStyle}>
                📘 Mis Programas
              </NavLink>
            )}

            {rol === "PSICOLOGO" && (
              <NavLink to="/dashboard/seguimientos" className={linkStyle}>
                🧠 Seguimientos
              </NavLink>
            )}

            {(rol === "INTERNO" || rol === "EX_INTERNO") && (
              <>
                <NavLink to="/dashboard/mis-programas" className={linkStyle}>
                  📚 Mis Programas
                </NavLink>
                <NavLink to="/dashboard/plan-reinsercion" className={linkStyle}>
                  🎯 Plan Reinserción
                </NavLink>
                <NavLink to="/dashboard/seguimiento-post" className={linkStyle}>
                  📞 Seguimiento Post
                </NavLink>
                <NavLink to="/dashboard/denuncias" className={linkStyle}>
                  📢 Denuncias
                </NavLink>
              </>
            )}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-8 text-red-300 hover:text-red-200 transition"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </aside>

      {/* Overlay cuando el sidebar está abierto en móvil */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        {/* Contenido */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;