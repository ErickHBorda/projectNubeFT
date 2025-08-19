import React, { useEffect, useState } from "react";
import {
  getProgramas,
  createPrograma,
  updatePrograma,
  deletePrograma,
} from "../services/programasService";
import {
  BookOpen,
  Hammer,
  Edit,
  Trash2,
  Plus,
  X,
  Save,
  Loader,
  AlertTriangle,
} from "lucide-react";

const Programas = () => {
  const [programas, setProgramas] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "", tipo: "EDUCATIVO" });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingPrograma, setDeletingPrograma] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar programas
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getProgramas();
      setProgramas(data);
      setError("");
    } catch (err) {
      setError("No se pudieron cargar los programas.");
      console.error("Error al obtener programas", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Modal de edición/creación ---
  const openModal = (programa = null) => {
    if (programa) {
      setForm({
        nombre: programa.nombre,
        descripcion: programa.descripcion,
        tipo: programa.tipo,
      });
      setEditingId(programa.id);
    } else {
      setForm({ nombre: "", descripcion: "", tipo: "EDUCATIVO" });
      setEditingId(null);
    }
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ nombre: "", descripcion: "", tipo: "EDUCATIVO" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.descripcion.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    try {
      if (editingId) {
        await updatePrograma(editingId, form);
      } else {
        await createPrograma(form);
      }
      closeModal();
      fetchData();
    } catch (err) {
      setError(editingId ? "Error al actualizar el programa." : "Error al crear el programa.");
      console.error("Error al guardar", err);
    }
  };

  // --- Eliminar programa ---
  const confirmDelete = (programa) => {
    setDeletingPrograma(programa);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingPrograma(null);
  };

  const handleDelete = async () => {
    try {
      await deletePrograma(deletingPrograma.id);
      fetchData();
    } catch (err) {
      setError("No se pudo eliminar el programa.");
      console.error("Error al eliminar", err);
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingPrograma(null);
    }
  };

  // Icono por tipo
  const TipoIcon = ({ tipo }) => (
    tipo === "EDUCATIVO" ? (
      <BookOpen className="text-blue-600" size={18} />
    ) : (
      <Hammer className="text-green-600" size={18} />
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      {/* Título */}
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
          📚 Programas Penitenciarios
        </h1>
        <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
          Gestiona programas educativos y laborales para la reinserción social de internos y ex internos.
        </p>
      </div>

      {/* Mensaje de error global */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle size={18} />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Botón principal */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-end">
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <Plus size={18} /> Nuevo Programa
        </button>
      </div>

      {/* Tabla */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader className="animate-spin text-indigo-600" size={36} />
            <p className="text-gray-500">Cargando programas...</p>
          </div>
        ) : programas.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No hay programas registrados.</p>
            <button
              onClick={() => openModal()}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 mx-auto"
            >
              <Plus size={14} /> Registrar el primero
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 uppercase text-xs tracking-wide">
                <tr>
                  <th className="py-4 px-6 font-semibold rounded-tl-lg">Nombre</th>
                  <th className="py-4 px-6 font-semibold">Descripción</th>
                  <th className="py-4 px-6 font-semibold">Tipo</th>
                  <th className="py-4 px-6 font-semibold rounded-tr-lg">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {programas.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                  >
                    <td
                      className="py-4 px-6 font-medium text-gray-800 max-w-xs truncate"
                      title={p.nombre}
                    >
                      {p.nombre}
                    </td>
                    <td
                      className="py-4 px-6 text-gray-600 max-w-md truncate"
                      title={p.descripcion}
                    >
                      {p.descripcion}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <TipoIcon tipo={p.tipo} />
                        <span
                          className={`capitalize px-2.5 py-1 rounded-full text-xs font-bold
                            ${p.tipo === "EDUCATIVO"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                            }`}
                        >
                          {p.tipo === "EDUCATIVO" ? "Educativo" : "Laboral"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 space-x-2">
                      <button
                        onClick={() => openModal(p)}
                        className="flex items-center gap-1 px-3 py-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition text-sm"
                        title="Editar"
                      >
                        <Edit size={14} /> Editar
                      </button>
                      <button
                        onClick={() => confirmDelete(p)}
                        className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition text-sm"
                        title="Eliminar"
                      >
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Edición/Creación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform animate-scaleIn">
            {/* Encabezado */}
            <div className="flex justify-between items-center border-b border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {editingId ? <Edit size={20} /> : <Plus size={20} />}
                {editingId ? "Editar Programa" : "Nuevo Programa"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start gap-2 text-sm">
                  <AlertTriangle size={16} className="mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Programa *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Alfabetización Básica"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  placeholder="Describe el objetivo, duración y beneficios del programa..."
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Programa
                </label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="EDUCATIVO">🎓 Educativo</option>
                  <option value="LABORAL">🛠️ Laboral</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition shadow font-medium disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={16} /> Procesando...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> {editingId ? "Actualizar" : "Crear"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && deletingPrograma && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-scaleIn">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-red-600">
                <Trash2 size={20} />
                <h3 className="text-2xl font-bold text-gray-800">Eliminar Programa</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                ¿Estás seguro de que deseas eliminar el programa <strong>"{deletingPrograma.nombre}"</strong>?
              </p>
              <p className="text-sm text-gray-500">
                Esta acción no se puede deshacer. Todos los datos asociados se perderán.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2 text-red-800">
                  <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    <strong>Advertencia:</strong> Esta acción es permanente.
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

      {/* Animaciones (Tailwind o CSS) */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Programas;