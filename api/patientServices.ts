import api from "axios";

// --- Types ---
export interface PatientCreateRequest {
  firstName: string;
  lastName: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone: string;
  email?: string;
  address?: string;
  insurance?: string;
  notes?: string;
  tags_json?: string;
  contact_json?: string;
}

export interface PatientUpdateRequest {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  phone?: string;
  email?: string;
  address?: string;
  insurance?: string;
  notes?: string;
  tags_json?: string;
  contact_json?: string;
}

// --- Services ---
export const getPatients = async (search?: string) => {
  const res = await api.get("/patients", {
    params: search ? { search } : {},
  });
  return res.data;
};

export const getPatientById = async (id: string) => {
  const res = await api.get(`/patients/${id}`);
  return res.data;
};

export const createPatient = async (data: PatientCreateRequest) => {
  const res = await api.post("/patients", data);
  return res.data;
};

export const updatePatient = async (id: string, data: PatientUpdateRequest) => {
  const res = await api.patch(`/patients/${id}`, data);
  return res.data;
};

export const deletePatient = async (id: string) => {
  const res = await api.delete(`/patients/${id}`);
  return res.data;
};