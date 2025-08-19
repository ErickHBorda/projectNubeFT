import { useState } from "react";
import { Search, User, Edit, Eye, Trash2 } from "lucide-react";

const UsuarioTable = ({
  titulo,
  usuarios,
  loading,
  busqueda,
  setBusqueda,
  onVer,
  onEditar,
  onCrear,
  children,
}) => {
  const [filtro, setFiltro] = useState("");

  const usuariosFiltrados = usuarios
    .filter((u) =>
      `${u.nombre} ${u.apellido} ${u.dni}`.toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((u) => {
      if (!filtro) return true;
      return u.estado?.toLowerCase() === filtro.toLowerCase();
    });

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* Encabezado con título y botón */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          <User className="text-blue-500" size={28} />
          {titulo}
        </h1>
        <button
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium"
          onClick={onCrear}
        >
          ➕ Registrar
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative max-w-lg mx-auto md:mx-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={`Buscar por nombre o DNI...`}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white text-gray-700 placeholder-gray-400 transition-all duration-200"
          />
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-52 bg-white rounded-xl shadow-md">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="mt-3 text-gray-600 font-medium">Cargando {titulo.toLowerCase()}...</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 uppercase text-sm tracking-wide">
              <tr>
                <th className="py-4 px-6 font-semibold">#</th>
                <th className="py-4 px-6 font-semibold">Nombre</th>
                <th className="py-4 px-6 font-semibold">DNI</th>
                <th className="py-4 px-6 font-semibold">Correo</th>
                <th className="py-4 px-6 font-semibold">Teléfono</th>
                <th className="py-4 px-6 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500 italic">
                    No se encontraron {titulo.toLowerCase()}.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((u, index) => (
                  <tr
                    key={u.id}
                    className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="py-4 px-6 text-gray-600 font-medium">{index + 1}</td>
                    <td className="py-4 px-6 font-medium text-gray-800">{u.nombre} {u.apellido}</td>
                    <td className="py-4 px-6 text-gray-700">{u.dni}</td>
                    <td className="py-4 px-6 text-gray-600 truncate max-w-xs" title={u.email}>
                      {u.email}
                    </td>
                    <td className="py-4 px-6 text-gray-700">{u.telefono || '—'}</td>
                    <td className="py-4 px-6 text-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1.5 rounded-full transition-all duration-150"
                        onClick={() => onVer(u)}
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 p-1.5 rounded-full transition-all duration-150"
                        onClick={() => onEditar(u)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 hover:bg-red-100 p-1.5 rounded-full transition-all duration-150"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modales (inyectados como children) */}
      {children}
    </div>
  );
};

export default UsuarioTable;