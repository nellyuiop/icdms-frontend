import api from "./axios";

export const createUser = async (data: any) => {

  const res = await api.post("/api/users", data);

  return res.data;

};

export const getUsers = async () => {

  const res = await api.get("/api/users");

  return res.data;

};

export const updateUserRole = async (id: string, role: string) => {

  const res = await api.patch(`/api/users/${id}/role`, {
    role,
  });

  return res.data;

};

export const deactivateUser = async (id: string) => {

  const res = await api.delete(`/api/users/${id}`);

  return res.data;

};

export const getRoles = async () => {

  const res = await api.get("/api/roles");

  return res.data;

};