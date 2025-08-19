import axios from "axios";

const API = "https://backend-service-982074768138.us-central1.run.app/api/usuarios/list";

export const getUsuarios = async () => {
  const user = JSON.parse(localStorage.getItem("user")); 
  const token = user?.token;
  console.log(token);

  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data.usuarios;
};

export const updateUsuario = async (user) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(
    `https://backend-service-982074768138.us-central1.run.app/api/usuarios/update/${user.id}`,
    user,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const createUsuario = async (usuario) => {
  const res = await axios.post(
    "https://backend-service-982074768138.us-central1.run.app/api/usuarios/insert",
    usuario
  );
  return res.data;
};

export const createPerfil = async (perfil) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const res = await axios.post(
    "https://backend-service-982074768138.us-central1.run.app/api/perfil/crear",
    perfil,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getPerfilByUsuarioId = async (usuarioId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const res = await axios.get(
    `https://backend-service-982074768138.us-central1.run.app/api/perfil/usuario/${usuarioId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.data.perfil;
};

