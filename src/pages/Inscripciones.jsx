import React, { useState, useEffect } from "react";
import {
    getAllInscripciones,
    updateInscripcion,
    deleteInscripcion,
    createInscripcion, // Asegúrate de que esta función exista en tu servicio
} from "../services/inscripcionService";
import { getProgramas } from "../services/programasService";
import { getUsuarios } from "../services/userService";
import {
    User,
    BookOpen,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Search,
    Loader,
    Plus,
    X,
    Save,
    AlertTriangle,
} from "lucide-react";

const Inscripciones = () => {
    const [inscripciones, setInscripciones] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEstado, setFilterEstado] = useState("");

    // Edición
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ estado: "", notaFinal: "" });

    // Eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(null);

    // Creación
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [nuevaInscripcion, setNuevaInscripcion] = useState({
        usuarioId: "",
        programaId: "",
        estado: "INSCRITO",
    });
    const [programas, setProgramas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loadingCreate, setLoadingCreate] = useState(false);

    // Cargar datos
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [inscripcionesData, programasData, usuariosData] = await Promise.all([
                    getAllInscripciones(),
                    getProgramas(),
                    getUsuarios(),
                ]);

                setInscripciones(inscripcionesData);
                setProgramas(programasData);
                setUsuarios(usuariosData.filter((u) => u.rol === "INTERNO" || u.rol === "EX_INTERNO"));
                setError("");
            } catch (err) {
                setError("No se pudieron cargar los datos.");
                console.error("Error al cargar inscripciones", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filtrar y buscar
    useEffect(() => {
        let result = inscripciones;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (i) =>
                    (i.usuario?.nombre + " " + i.usuario?.apellido).toLowerCase().includes(term) ||
                    i.nombrePrograma.toLowerCase().includes(term)
            );
        }

        if (filterEstado) {
            result = result.filter((i) => i.estado === filterEstado);
        }

        setFiltered(result);
    }, [searchTerm, filterEstado, inscripciones]);

    // --- Editar inscripción ---
    const startEditing = (ins) => {
        setEditing(ins.id);
        setForm({
            estado: ins.estado,
            notaFinal: ins.notaFinal || "",
        });
    };

    const cancelEditing = () => {
        setEditing(null);
        setForm({ estado: "", notaFinal: "" });
    };

    const saveEditing = async (id) => {
        try {
            const updatedData = { ...form };
            if (form.notaFinal === "") delete updatedData.notaFinal;

            await updateInscripcion(id, updatedData);
            setInscripciones((prev) =>
                prev.map((i) =>
                    i.id === id
                        ? { ...i, estado: form.estado, notaFinal: form.notaFinal || null }
                        : i
                )
            );
            cancelEditing();
        } catch (err) {
            setError("Error al actualizar la inscripción.");
            console.error("Error al actualizar", err);
        }
    };

    // --- Eliminar inscripción ---
    const confirmDelete = (ins) => {
        setDeleting(ins);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await deleteInscripcion(deleting.id);
            setInscripciones((prev) => prev.filter((i) => i.id !== deleting.id));
            setIsDeleteModalOpen(false);
            setDeleting(null);
        } catch (err) {
            setError("No se pudo eliminar la inscripción.");
            console.error("Error al eliminar", err);
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDeleting(null);
    };

    // --- Crear inscripción ---
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!nuevaInscripcion.usuarioId || !nuevaInscripcion.programaId) {
            setError("Debe seleccionar un interno y un programa.");
            return;
        }
        try {
            setLoadingCreate(true);
            const res = await createInscripcion(nuevaInscripcion);
            const usuario = usuarios.find((u) => u.id === nuevaInscripcion.usuarioId);
            const programa = programas.find((p) => p.id === nuevaInscripcion.programaId);

            setInscripciones((prev) => [
                ...prev,
                {
                    id: res.data?.id || Date.now().toString(),
                    ...nuevaInscripcion,
                    nombrePrograma: programa?.nombre || "Desconocido",
                    fechaInscripcion: new Date().toISOString().split("T")[0],
                    usuario,
                    notaFinal: null,
                },
            ]);
            setIsCreateModalOpen(false);
            setNuevaInscripcion({ usuarioId: "", programaId: "", estado: "INSCRITO" });
            setError("");
        } catch (err) {
            setError("Error al crear la inscripción.");
            console.error("Error al crear inscripción", err);
        } finally {
            setLoadingCreate(false);
        }
    };

    // Icono de estado
    const EstadoIcon = ({ estado }) => (
        estado === "INSCRITO" ? (
            <CheckCircle className="text-blue-600" size={18} />
        ) : (
            <XCircle className="text-green-600" size={18} />
        )
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Título */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight flex items-center justify-center gap-3">
                        📝 Gestión de Inscripciones
                    </h1>
                    <p className="text-gray-600 mt-3 text-lg">
                        Administra las inscripciones de internos y ex internos a programas educativos y laborales.
                    </p>
                </div>

                {/* Mensaje de error global */}
                {error && (
                    <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm animate-fadeIn">
                        <div className="flex items-center gap-2 text-red-700">
                            <AlertTriangle size={18} />
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Filtros y búsqueda */}
                <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Búsqueda */}
                        <div className="relative flex-1 max-w-lg">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o programa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Filtro de estado */}
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-gray-700 min-w-48"
                        >
                            <option value="">Todos los estados</option>
                            <option value="INSCRITO">🟢 Inscrito</option>
                            <option value="FINALIZADO">✅ Finalizado</option>
                        </select>
                    </div>
                </div>

                {/* Botón de nueva inscripción */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:from-green-700 hover:to-emerald-800 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
                    >
                        <Plus size={18} /> Nueva Inscripción
                    </button>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                            <Loader className="animate-spin text-indigo-600" size={36} />
                            <p className="text-gray-500">Cargando inscripciones...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-16 text-center">
                            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-500 text-lg">No hay inscripciones que coincidan con los filtros.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-700">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 uppercase text-xs tracking-wide">
                                    <tr>
                                        <th className="py-4 px-6 font-semibold rounded-tl-lg">Interno</th>
                                        <th className="py-4 px-6 font-semibold">Programa</th>
                                        <th className="py-4 px-6 font-semibold">Fecha de Inicio</th>
                                        <th className="py-4 px-6 font-semibold">Estado</th>
                                        <th className="py-4 px-6 font-semibold">Nota Final</th>
                                        <th className="py-4 px-6 font-semibold rounded-tr-lg">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filtered.map((i) => (
                                        <tr
                                            key={i.id}
                                            className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-full">
                                                        <User className="text-blue-600" size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{i.usuario?.nombre} {i.usuario?.apellido}</p>
                                                        <p className="text-xs text-gray-500">DNI: {i.usuario?.dni}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="text-indigo-600" size={16} />
                                                    <span className="font-medium text-gray-800">{i.nombrePrograma}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {new Date(i.fechaInscripcion).toLocaleDateString("es-ES")}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <EstadoIcon estado={i.estado} />
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                              ${i.estado === "INSCRITO"
                                                                ? "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                                                                : "bg-green-100 text-green-800 ring-1 ring-green-200"
                                                            }`}
                                                    >
                                                        {i.estado === "INSCRITO" ? "Inscrito" : "Finalizado"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {editing === i.id ? (
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="20"
                                                        value={form.notaFinal}
                                                        onChange={(e) =>
                                                            setForm({ ...form, notaFinal: e.target.value })
                                                        }
                                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        placeholder="10.0"
                                                    />
                                                ) : (
                                                    <span className="text-gray-700 font-medium">
                                                        {i.notaFinal !== null ? parseFloat(i.notaFinal).toFixed(1) : "—"}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 space-x-2">
                                                {editing === i.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => saveEditing(i.id)}
                                                            disabled={loading}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm shadow"
                                                        >
                                                            <Save size={14} /> Guardar
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition text-sm"
                                                        >
                                                            <X size={14} /> Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startEditing(i)}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition text-sm"
                                                        >
                                                            <Edit size={14} /> Editar
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDelete(i)}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition text-sm"
                                                        >
                                                            <Trash2 size={14} /> Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal: Crear Inscripción */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 bg-white/20 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform animate-scaleIn">
                            <div className="flex justify-between items-center border-b border-gray-200 p-6">
                                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <Plus size={20} /> Nueva Inscripción
                                </h3>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    disabled={loadingCreate}
                                    className="text-gray-500 hover:text-gray-700 transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start gap-2 text-sm">
                                        <AlertTriangle size={16} className="mt-0.5" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Interno */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Interno o Ex Interno *
                                    </label>
                                    <select
                                        value={nuevaInscripcion.usuarioId}
                                        onChange={(e) =>
                                            setNuevaInscripcion({ ...nuevaInscripcion, usuarioId: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        required
                                    >
                                        <option value="">Seleccionar interno...</option>
                                        {usuarios.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.nombre} {u.apellido} (DNI: {u.dni}, Rol: {u.rol === "INTERNO" ? "Interno" : "Ex Interno"})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Programa */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Programa *
                                    </label>
                                    <select
                                        value={nuevaInscripcion.programaId}
                                        onChange={(e) =>
                                            setNuevaInscripcion({ ...nuevaInscripcion, programaId: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        required
                                    >
                                        <option value="">Seleccionar programa...</option>
                                        {programas.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.nombre} ({p.tipo === "EDUCATIVO" ? "🎓 Educativo" : "🛠️ Laboral"})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Estado (solo lectura) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                                    <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 font-medium">
                                        INSCRITO
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        disabled={loadingCreate}
                                        className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loadingCreate}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow font-medium disabled:opacity-70"
                                    >
                                        {loadingCreate ? (
                                            <>
                                                <Loader className="animate-spin" size={16} /> Creando...
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={16} /> Crear Inscripción
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal: Confirmar Eliminación */}
                {isDeleteModalOpen && deleting && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 animate-fadeIn">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-scaleIn">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center gap-2 text-red-600">
                                    <Trash2 size={20} />
                                    <h3 className="text-2xl font-bold text-gray-800">Eliminar Inscripción</h3>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <p className="text-gray-700">
                                    ¿Estás seguro de eliminar la inscripción de <strong>{deleting.usuario?.nombre} {deleting.usuario?.apellido}</strong> en el programa <strong>"{deleting.nombrePrograma}"</strong>?
                                </p>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-2 text-red-800">
                                        <AlertTriangle size={16} className="mt-0.5" />
                                        <span className="text-sm">
                                            <strong>Advertencia:</strong> Esta acción no se puede deshacer.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={cancelDelete}
                                    className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow font-medium disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="animate-spin" size={16} /> Eliminando...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} /> Sí, Eliminar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Animaciones */}
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
        </div>
    );
};

export default Inscripciones;