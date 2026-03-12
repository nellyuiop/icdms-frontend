// api/axios.ts
import axios, { AxiosInstance } from "axios";

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", // adjust your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors for auth tokens if needed
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
