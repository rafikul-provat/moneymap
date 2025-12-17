import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
<<<<<<< HEAD
=======
  withCredentials: false,
>>>>>>> c56a79dcf3298de5d0121ced1b3136a56cccebca
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
