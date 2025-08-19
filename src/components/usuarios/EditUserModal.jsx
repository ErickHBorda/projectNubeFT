import { useState } from "react";
import { X } from "lucide-react";

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">✏️ Editar Usuario</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="w-1/2 p-2 border rounded"
              required
            />
            <input
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              className="w-1/2 p-2 border rounded"
              required
            />
          </div>

          <input
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            placeholder="DNI"
            className="w-full p-2 border rounded"
            required
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="w-full p-2 border rounded"
            required
          />

          <input
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            className="w-full p-2 border rounded"
          />

          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="ADMIN">ADMIN</option>
            <option value="DOCENTE">DOCENTE</option>
            <option value="PSICOLOGO">PSICOLOGO</option>
            <option value="INTERNO">INTERNO</option>
            <option value="EX_INTERNO">EX_INTERNO</option>
          </select>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;