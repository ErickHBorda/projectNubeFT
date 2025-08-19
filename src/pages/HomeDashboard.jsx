import { useAuth } from "../context/AuthContext";
import { BookOpen, Users, Shield, Briefcase } from "lucide-react";
import { NavLink } from "react-router-dom"; 

const HomeDashboard = () => {
  const { user } = useAuth();
  const { nombre, rol } = user;

  // Mapeo de rol a título y descripción
  const rolInfo = {
    ADMIN: {
      title: "Administrador del Sistema",
      desc: "Gestiona usuarios, programas, denuncias y reportes.",
      color: "from-blue-500 to-blue-700",
      icon: <Users className="w-8 h-8" />,
    },
    DOCENTE: {
      title: "Docente",
      desc: "Gestiona tus programas y realiza seguimientos educativos.",
      color: "from-green-500 to-green-700",
      icon: <BookOpen className="w-8 h-8" />,
    },
    PSICOLOGO: {
      title: "Psicólogo",
      desc: "Realiza seguimientos psicológicos y apoyo emocional.",
      color: "from-purple-500 to-purple-700",
      icon: <Shield className="w-8 h-8" />,
    },
    INTERNO: {
      title: "Interno",
      desc: "Accede a tus programas, plan de reinserción y denuncias.",
      color: "from-indigo-500 to-indigo-700",
      icon: <Briefcase className="w-8 h-8" />,
    },
    EX_INTERNO: {
      title: "Ex Interno",
      desc: "Sigue tu reinserción laboral y social.",
      color: "from-orange-500 to-orange-700",
      icon: <Briefcase className="w-8 h-8" />,
    },
  };

  const info = rolInfo[rol] || rolInfo.ADMIN;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Hola, {nombre} 👋</h1>
        <p className="text-gray-600 mt-2">Bienvenido al sistema de reinserción social</p>
      </div>

      {/* Tarjeta de rol */}
      <div className={`bg-gradient-to-r ${info.color} text-white p-8 rounded-2xl shadow-xl mb-10 text-center`}>
        <div className="flex justify-center mb-4">{info.icon}</div>
        <h2 className="text-2xl font-bold">{info.title}</h2>
        <p className="mt-2 opacity-90">{info.desc}</p>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rol === "ADMIN" && (
          <>
            <ActionCard to="/dashboard/usuarios" label="Gestionar Usuarios" bg="bg-blue-600" />
            <ActionCard to="/dashboard/programas" label="Ver Programas" bg="bg-indigo-600" />
            <ActionCard to="/dashboard/denuncias" label="Revisar Denuncias" bg="bg-red-600" />
          </>
        )}
        {rol === "DOCENTE" && (
          <>
            <ActionCard to="/dashboard/programas" label="Mis Programas" bg="bg-green-600" />
            <ActionCard to="/dashboard/inscripciones" label="Inscripciones" bg="bg-teal-600" />
          </>
        )}
        {(rol === "INTERNO" || rol === "EX_INTERNO") && (
          <>
            <ActionCard to="/dashboard/mis-programas" label="Mis Programas" bg="bg-indigo-600" />
            <ActionCard to="/dashboard/plan-reinsercion" label="Plan de Reinserción" bg="bg-purple-600" />
            <ActionCard to="/dashboard/denuncias" label="Presentar Denuncia" bg="bg-red-600" />
          </>
        )}
        {rol === "PSICOLOGO" && (
          <ActionCard to="/dashboard/seguimientos" label="Seguimientos" bg="bg-purple-600" />
        )}
      </div>
    </div>
  );
};

// Componente de acción rápida
const ActionCard = ({ to, label, bg }) => (
  <NavLink
    to={to}
    className={`${bg} text-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all text-center font-medium`}
  >
    {label}
  </NavLink>
);

export default HomeDashboard;