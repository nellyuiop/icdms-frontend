import api from "./axios";

export const login = async (email: string, password: string) => {

  const res = await api.post("/auth/login", {
    email,
    password,
  });

  return res.data;

};

export const register = async (data: any) => {

  const res = await api.post("/auth/register", data);

  return res.data;

};

export const getCurrentUser = async () => {

  const res = await api.get("/auth/me");

  return res.data;

};