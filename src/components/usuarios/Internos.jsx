// src/components/usuarios/Internos.jsx
import { useState, useEffect } from "react";
import { getUsuarios, getPerfilByUsuarioId } from "../../services/userService";
import UsuarioTable from "./UsuarioTable";
import UserModal from "./UserModal";
import EditUserModal from "./EditUserModal";
import CreateUserModal from "./CreateUserModal";

const Internos = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [modalCrear, setModalCrear] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);

    useEffect(() => {
        const cargarInternos = async () => {
            try {
                const data = await getUsuarios();
                const internos = data.filter((u) => u.rol === "INTERNO");
                setUsuarios(internos);
            } catch (error) {
                console.error("Error al obtener internos:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarInternos();
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
            // Refrescar lista
            const data = await getUsuarios();
            setUsuarios(data.filter((u) => u.rol === "INTERNO"));
            setUsuarioEditando(null);
        } catch (error) {
            console.error("Error actualizando usuario", error);
        }
    };

    return (
        <UsuarioTable
            titulo="👥 Internos"
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
                        setUsuarios(data.filter((u) => u.rol === "INTERNO"));
                    }}
                    rolFijo="INTERNO" // ← Añade esta línea
                />
            )}
        </UsuarioTable>
    );
};

export default Internos;