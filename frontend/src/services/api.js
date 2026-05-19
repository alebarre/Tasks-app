import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Adjust if running backend on different port
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@TaskApp:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
