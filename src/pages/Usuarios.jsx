import { useEffect, useState } from "react";
import { getUsuarios, updateUsuario, createUsuario, getPerfilByUsuarioId } from "../services/userService";
import { Loader2, Search } from "lucide-react";
import UserModal from "../components/usuarios/UserModal";
import EditUserModal from "../components/usuarios/EditUserModal";
import CreateUserModal from "../components/usuarios/CreateUserModal";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [modalCrear, setModalCrear] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      const internos = data.filter(
        (u) => u.rol === "INTERNO" || u.rol === "EX_INTERNO"
      );
      console.log("data: " + data.internos);
      setUsuarios(internos);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleGuardarEdicion = async (datosActualizados) => {
    try {
      await updateUsuario(datosActualizados); // llamas a tu servicio
      fetchUsuarios(); // recarga la tabla
      setUsuarioEditando(null);
    } catch (error) {
      console.error("Error actualizando usuario", error);
    }
  };

  const handleVerUsuario = async (usuario) => {
    try {
      const perfil = await getPerfilByUsuarioId(usuario.id);
      setUsuarioSeleccionado(usuario);
      setPerfilSeleccionado(perfil);
    } catch (error) {
      console.error("Error cargando perfil:", error);
    }
  };


  useEffect(() => {
    cargarUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombre} ${u.apellido} ${u.dni}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">👥 Internos y Ex Internos</h1>

      {/* 🔍 Buscador */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o DNI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
          <span className="ml-2">Cargando usuarios...</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
          <div className="mb-4 flex justify-end">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => setModalCrear(true)}
            >
              ➕ Registrar Interno/Ex Interno
            </button>
          </div>
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">DNI</th>
                <th className="py-2 px-4">Correo</th>
                <th className="py-2 px-4">Teléfono</th>
                <th className="py-2 px-4">Rol</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u, index) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{u.nombre} {u.apellido}</td>
                  <td className="py-2 px-4">{u.dni}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">{u.telefono}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium 
                      ${u.rol === "INTERNO" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      className="text-blue-500 hover:underline mr-2"
                      onClick={() => handleVerUsuario(u)}
                    >
                      Ver
                    </button>
                    <button
                      className="text-yellow-500 hover:underline"
                      onClick={() => setUsuarioEditando(u)}
                    >
                      Editar
                    </button>
                    <button className="text-red-500 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuarioSeleccionado && (
            <UserModal
              user={usuarioSeleccionado}
              perfil={perfilSeleccionado}
              onClose={() => {
                setUsuarioSeleccionado(null);
                setPerfilSeleccionado(null);
              }}
            />
          )}
          {usuarioEditando && (
            <EditUserModal
              user={usuarioEditando}
              onClose={() => setUsuarioEditando(null)}
              onSave={handleGuardarEdicion}
            />
          )}
          {modalCrear && (
            <CreateUserModal
              onClose={() => setModalCrear(false)}
              onSuccess={cargarUsuarios}
            />
          )}

          {usuariosFiltrados.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No se encontraron usuarios que coincidan.</p>
          )}
          <br />
        </div>

      )}
    </div>
  );
};

export default Usuarios;