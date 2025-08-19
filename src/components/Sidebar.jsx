import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  BookOpen,
  Shield,
  FileText,
  Briefcase,
  LogOut,
} from "lucide-react";

const Sidebar = ({ onLogout }) => {
  const links = [
    { to: "/dashboard", label: "Inicio", icon: <Home size={18} /> },
    { to: "/usuarios", label: "Usuarios", icon: <Users size={18} /> },
    { to: "/internos", label: "Internos", icon: <Users size={18} /> },
    { to: "/ex-internos", label: "Ex Internos", icon: <Users size={18} /> },
    { to: "/programas", label: "Programas", icon: <BookOpen size={18} /> },
    { to: "/inscripciones", label: "Inscripciones", icon: <BookOpen size={18} /> },
    { to: "/seguimientos", label: "Seguimiento", icon: <Shield size={18} /> },
    { to: "/denuncias", label: "Denuncias", icon: <FileText size={18} /> },
    { to: "/reinsercion", label: "Reinserción", icon: <Briefcase size={18} /> },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 h-screen fixed top-0 left-0 p-4 flex flex-col shadow-lg z-10">
      <h1 className="text-xl font-bold mb-8 text-center">🛡️ Sistema</h1>
      <nav className="flex flex-col gap-4 flex-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition hover:bg-gray-700 ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button
        onClick={onLogout}
        className="mt-auto text-sm flex items-center gap-2 hover:text-red-400 transition"
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>
    </div>
  );
};

export default Sidebar;