import axios from "axios";

const api = axios.create({
  baseURL: "https://api.cliniq.cloud",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["x-api-key"] = "icdms_2026_ntccgfjck";

  return config;
});

export default api;