import axios from "axios";

const API_URL = "https://backend-service-982074768138.us-central1.run.app/api/programas";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

// Crear programa
export const createPrograma = async (programa) => {
  const token = getToken();
  const res = await axios.post(`${API_URL}/crear`, programa, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Actualizar programa
export const updatePrograma = async (id, programa) => {
  const token = getToken();
  const res = await axios.put(`${API_URL}/actualizar/${id}`, programa, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Listar todos
export const getProgramas = async () => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/listar`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  console.log("Respuesta listar programas:", res.data); // 👈 revisa en consola
  return res.data.data?.programas || []; // ajusta según la estructura real
};

// Listar por tipo (EDUCATIVO o LABORAL)
export const getProgramasByTipo = async (tipo) => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/tipo/${tipo}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Eliminar
export const deletePrograma = async (id) => {
  const token = getToken();
  await axios.delete(`${API_URL}/eliminar/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};