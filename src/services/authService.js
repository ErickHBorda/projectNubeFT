import axios from "axios";

const API = "https://backend-service-982074768138.us-central1.run.app/api/usuarios/login";

export const loginUser = async (email, password) => {
  const response = await axios.post(API, { email, password });
  return response.data;
};