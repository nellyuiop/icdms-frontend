import api from "axios";

export interface CreateUserRequest {
  name?: string;
  email: string;
  password: string;
  role?: "ADMIN" | "CLINICIAN" | "STAFF";
}

export interface UpdateUserRoleRequest {
  role: "ADMIN" | "CLINICIAN" | "STAFF";
}

export const getUsers = async () => {
  const res = await api.get("/api/users");
  return res.data;
};

export const createUser = async (data: CreateUserRequest) => {
  const res = await api.post("/api/users", data);
  return res.data;
};

export const updateUserRole = async (id: string, data: UpdateUserRoleRequest) => {
  const res = await api.patch(`/api/users/${id}/role`, data);
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