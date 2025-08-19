// src/components/usuarios/ExInternos.jsx
import { useState, useEffect } from "react";
import { getUsuarios, getPerfilByUsuarioId } from "../../services/userService";
import UsuarioTable from "./UsuarioTable";
import UserModal from "./UserModal";
import EditUserModal from "./EditUserModal";
import CreateUserModal from "./CreateUserModal";

const ExInternos = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [modalCrear, setModalCrear] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);

    useEffect(() => {
        const cargarExInternos = async () => {
            try {
                const data = await getUsuarios();
                const exInternos = data.filter((u) => u.rol === "EX_INTERNO");
                setUsuarios(exInternos);
            } catch (error) {
                console.error("Error al obtener ex internos:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarExInternos();
    }, []);

    const handleVerUsuario = async (usuario) => {
        try {
            const perfil = await getPerfilByUsuarioId(usuario.id);
            setUsuarioSeleccionado(usuario);
            setPerfilSeleccionado(perfil);
        } catch (error) {
            console.error("Error cargando perfil:", error);
        }
    };

    const handleGuardarEdicion = async (datosActualizados) => {
        try {
            await updateUsuario(datosActualizados);
            const data = await getUsuarios();
            setUsuarios(data.filter((u) => u.rol === "EX_INTERNO"));
            setUsuarioEditando(null);
        } catch (error) {
            console.error("Error actualizando usuario", error);
        }
    };

    return (
        <UsuarioTable
            titulo="👥 Ex Internos"
            usuarios={usuarios}
            loading={loading}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            onVer={handleVerUsuario}
            onEditar={setUsuarioEditando}
            onCrear={() => setModalCrear(true)}
        >
            {/* Modales */}
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
                    onSuccess={async () => {
                        const data = await getUsuarios();
                        setUsuarios(data.filter((u) => u.rol === "EX_INTERNO"));
                    }}
                    rolFijo="EX_INTERNO" // ← Rol fijo para ex internos
                />
            )}
        </UsuarioTable>
    );
};

export default ExInternos;