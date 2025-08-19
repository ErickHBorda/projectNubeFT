import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { FaShieldAlt, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await loginUser(form.email, form.password);
            if (res.type === "success") {
                login(res.data.user);
                navigate("/dashboard");
            } else {
                setError("Credenciales incorrectas");
            }
        } catch (err) {
            setError("Ocurrió un error. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            {/* Fondo con partículas sutiles */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute w-64 h-64 bg-indigo-500 rounded-full -top-20 -left-20"></div>
                <div className="absolute w-96 h-96 bg-blue-500 rounded-full -bottom-40 -right-40"></div>
            </div>

            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md mx-4 relative z-10 transform transition-all hover:scale-102 duration-300">
                {/* Icono principal */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full mb-4 shadow-lg">
                        <FaShieldAlt className="text-2xl" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                        Sistema Penitenciario
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">Acceso seguro autorizado</p>
                </div>

                {/* Mensaje de error */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 flex items-center space-x-2 border-l-4 border-red-500 animate-pulse">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campo de correo */}
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="tu@correo.gov"
                            className="w-full pl-3 pr-4 h-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                            required
                        />
                    </div>

                    {/* Campo de contraseña */}
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                            required
                        />
                    </div>

                    {/* Botón de login */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                <span>Iniciando...</span>
                            </>
                        ) : (
                            <span>Iniciar sesión</span>
                        )}
                    </button>
                </form>

                {/* Pie de página */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        © 2025 Sistema Penitenciario Nacional. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;