// src/components/CreateUserModal.jsx
import { useState } from "react";
import { createUsuario, createPerfil, getUsuarios } from "../../services/userService";
import { X, CheckCircle, AlertCircle, Loader } from "lucide-react";

const CreateUserModal = ({ onClose, onSuccess, rolFijo }) => {
  const [formUsuario, setFormUsuario] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    password: "",
    telefono: "",
    rol: rolFijo || "INTERNO",
  });

  const [formPerfil, setFormPerfil] = useState({
    delito: "",
    sentenciaAnios: "",
    establecimiento: "",
    nivelEducativo: "",
    ocupacionAnterior: "",
    fechaIngreso: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formUsuario.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formUsuario.apellido.trim()) newErrors.apellido = "El apellido es obligatorio.";
    if (!formUsuario.dni.trim()) newErrors.dni = "El DNI es obligatorio.";
    else if (!/^\d{8}$/.test(formUsuario.dni)) newErrors.dni = "El DNI debe tener 8 dígitos.";

    if (!formUsuario.email.trim()) newErrors.email = "El correo es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(formUsuario.email))
      newErrors.email = "Correo inválido.";

    if (!formUsuario.password) newErrors.password = "La contraseña es obligatoria.";
    else if (formUsuario.password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";

    if (rolFijo === "INTERNO" || !rolFijo) {
      if (!formPerfil.delito.trim()) newErrors.delito = "El delito es obligatorio.";
      if (!formPerfil.fechaIngreso) newErrors.fechaIngreso = "La fecha de ingreso es obligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangeUsuario = (e) => {
    const { name, value } = e.target;
    setFormUsuario((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleChangePerfil = (e) => {
    const { name, value } = e.target;
    setFormPerfil((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMensaje("");
    setErrors({});

    try {
      const usuarioResp = await createUsuario(formUsuario);

      if (usuarioResp.type === "success") {
        // Buscar el usuario creado
        const listaUsuarios = await getUsuarios();
        const nuevoUsuario = listaUsuarios.find((u) => u.dni === formUsuario.dni);

        if (nuevoUsuario && (formUsuario.rol === "INTERNO" || formUsuario.rol === "EX_INTERNO")) {
          await createPerfil({ ...formPerfil, usuarioId: nuevoUsuario.id });
        }

        setMensaje("✅ Usuario registrado con éxito.");
        onSuccess();

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMensaje(`❌ ${usuarioResp.message || "Error al registrar."}`);
      }
    } catch (error) {
      console.error("Error registrando usuario:", error);
      setMensaje("❌ Error en el registro. Revisa los datos e intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all scale-100">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Registrar{" "}
            {rolFijo === "INTERNO"
              ? "Interno"
              : rolFijo === "EX_INTERNO"
                ? "Ex Interno"
                : "Usuario"}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div
            className={`p-4 text-center text-sm font-medium border-b ${mensaje.includes("❌")
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
              } flex items-center justify-center gap-2`}
          >
            {mensaje.includes("✅") ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {mensaje}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Datos del Usuario */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2 text-lg">Datos Personales</h3>

              <div>
                <input
                  name="nombre"
                  placeholder="Nombre *"
                  value={formUsuario.nombre}
                  onChange={handleChangeUsuario}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.nombre
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.nombre}
                  </p>
                )}
              </div>

              <div>
                <input
                  name="apellido"
                  placeholder="Apellido *"
                  value={formUsuario.apellido}
                  onChange={handleChangeUsuario}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.apellido
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                />
                {errors.apellido && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.apellido}
                  </p>
                )}
              </div>

              <div>
                <input
                  name="dni"
                  placeholder="DNI (8 dígitos) *"
                  value={formUsuario.dni}
                  onChange={handleChangeUsuario}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.dni
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                />
                {errors.dni && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.dni}
                  </p>
                )}
              </div>

              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Correo electrónico *"
                  value={formUsuario.email}
                  onChange={handleChangeUsuario}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <input
                  name="password"
                  type="password"
                  placeholder="Contraseña *"
                  value={formUsuario.password}
                  onChange={handleChangeUsuario}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.password}
                  </p>
                )}
              </div>

              <div>
                <input
                  name="telefono"
                  placeholder="Teléfono"
                  value={formUsuario.telefono}
                  onChange={handleChangeUsuario}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Rol (fijo o seleccionable) */}
              {!rolFijo ? (
                <div>
                  <select
                    name="rol"
                    value={formUsuario.rol}
                    onChange={handleChangeUsuario}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none bg-white"
                  >
                    <option value="INTERNO">INTERNO</option>
                    <option value="EX_INTERNO">EX_INTERNO</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Rol</label>
                  <input
                    type="text"
                    value={formUsuario.rol === "INTERNO" ? "Interno" : "Ex Interno"}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
                  />
                </div>
              )}
            </div>

            {/* Datos del Perfil (solo para INTERNOS o si no es rol fijo) */}
            {(rolFijo === "INTERNO" || rolFijo === "EX_INTERNO" || (!rolFijo && (formUsuario.rol === "INTERNO" || formUsuario.rol === "EX_INTERNO"))) && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2 text-lg">Perfil Penitenciario</h3>

                <div>
                  <input
                    name="delito"
                    placeholder="Delito *"
                    value={formPerfil.delito}
                    onChange={handleChangePerfil}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.delito
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                      }`}
                  />
                  {errors.delito && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.delito}
                    </p>
                  )}
                </div>

                <input
                  name="sentenciaAnios"
                  type="number"
                  placeholder="Sentencia (años)"
                  value={formPerfil.sentenciaAnios}
                  onChange={handleChangePerfil}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                />

                <input
                  name="establecimiento"
                  placeholder="Establecimiento"
                  value={formPerfil.establecimiento}
                  onChange={handleChangePerfil}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                />

                <input
                  name="nivelEducativo"
                  placeholder="Nivel Educativo"
                  value={formPerfil.nivelEducativo}
                  onChange={handleChangePerfil}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                />

                <input
                  name="ocupacionAnterior"
                  placeholder="Ocupación anterior"
                  value={formPerfil.ocupacionAnterior}
                  onChange={handleChangePerfil}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                />

                <div>
                  <input
                    name="fechaIngreso"
                    type="date"
                    value={formPerfil.fechaIngreso}
                    onChange={handleChangePerfil}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.fechaIngreso
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                      }`}
                  />
                  {errors.fechaIngreso && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.fechaIngreso}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Registrando...
                </>
              ) : (
                "Registrar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;