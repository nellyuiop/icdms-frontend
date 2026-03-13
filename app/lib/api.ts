import axios from "axios";

const api = axios.create({
  baseURL: "https://api.cliniq.cloud",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ADD THIS LINE
    config.headers["x-api-key"] = "icdms_2026_ntccgfjck";
  }

  return config;
});

export default api;
