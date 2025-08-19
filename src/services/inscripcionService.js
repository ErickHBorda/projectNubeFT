import axios from "axios";

const API_URL = "https://backend-service-982074768138.us-central1.run.app/api/inscripciones";

// Función para obtener el token desde localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

// Crear inscripción
export const createInscripcion = async (inscripcion) => {
  const token = getToken();
  const res = await axios.post(`${API_URL}/crear`, inscripcion, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Obtener todas las inscripciones
export const getAllInscripciones = async () => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/todas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data.inscripciones; // Accedemos al array real
};
// Obtener inscripciones por usuario
export const getInscripcionesByUsuario = async (usuarioId) => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/usuario/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Actualizar inscripción
export const updateInscripcion = async (id, inscripcion) => {
  const token = getToken();
  const res = await axios.put(`${API_URL}/update/${id}`, inscripcion, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Eliminar inscripción
export const deleteInscripcion = async (id) => {
  const token = getToken();
  const res = await axios.delete(`${API_URL}/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};