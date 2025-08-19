import { X } from "lucide-react";

const UserModal = ({ user, perfil, onClose }) => {
  if (!user) return null;

  return (
    <div 
      className="fixed inset-0 bg-white/20 backdrop-blur-md z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-fadeInUp">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            👤 Detalles del Usuario
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition duration-200"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-6 text-gray-700">
          {/* Datos Personales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Nombre
              </span>
              <span className="text-lg font-medium text-gray-800">
                {user.nombre} {user.apellido}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                DNI
              </span>
              <span className="text-lg font-medium text-gray-800">{user.dni}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Correo
              </span>
              <span className="text-sm text-gray-700 truncate" title={user.email}>
                {user.email}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Teléfono
              </span>
              <span className="text-sm text-gray-700">{user.telefono || "No registrado"}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Rol
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm
                  ${
                    user.rol === "INTERNO"
                      ? "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                      : user.rol === "EX_INTERNO"
                      ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                      : "bg-gray-100 text-gray-800 ring-1 ring-gray-200"
                  }`}
              >
                {user.rol === "INTERNO"
                  ? "Interno"
                  : user.rol === "EX_INTERNO"
                  ? "Ex Interno"
                  : user.rol}
              </span>
            </div>
          </div>

          {/* Perfil Penitenciario (si existe) */}
          {perfil && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-5">
                📄 Información del Perfil
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-600">Delito</span>
                  <span className="text-base text-gray-800">{perfil.delito || "N/A"}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-600">Sentencia</span>
                  <span className="text-base text-gray-800">
                    {perfil.sentenciaAnios ? `${perfil.sentenciaAnios} años` : "N/A"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-600">Establecimiento</span>
                  <span className="text-base text-gray-800">{perfil.establecimiento || "N/A"}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-600">Nivel Educativo</span>
                  <span className="text-base text-gray-800">{perfil.nivelEducativo || "N/A"}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-600">Ocupación Anterior</span>
                  <span className="text-base text-gray-800">{perfil.ocupacionAnterior || "N/A"}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-600">Fecha de Ingreso</span>
                  <span className="text-base text-gray-800">
                    {perfil.fechaIngreso
                      ? new Date(perfil.fechaIngreso).toLocaleDateString("es-ES", {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      : "N/A"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-600">Fecha de Egreso</span>
                  <span
                    className={`text-base font-medium ${
                      perfil.fechaEgreso ? "text-green-700" : "text-red-500"
                    }`}
                  >
                    {perfil.fechaEgreso
                      ? new Date(perfil.fechaEgreso).toLocaleDateString("es-ES", {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      : "Pendiente"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje si no hay perfil */}
          {!perfil && (
            <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-200 mt-2">
              <span className="text-sm text-gray-500 italic">
                No hay información de perfil disponible.
              </span>
            </div>
          )}
        </div>

        {/* Botón de cierre */}
        <div className="px-6 py-4 bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors duration-200 text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;