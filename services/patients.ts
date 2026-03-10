import { api } from "./api";

export interface Patient {
  id: string;
  name: string;
  dob: string;
  phone?: string;
  email?: string;
  address?: string;
  provider?: string;
  lastVisit?: string;
}

export const patientService = {
  // Get all patients
  async getAll() {
    return api.get("/patients");
  },

  // Get patient by ID
  async getById(id: string) {
    return api.get(`/patients/${id}`);
  },

  // Create new patient
  async create(data: Partial<Patient>) {
    return api.post("/patients", data);
  },

  // Update patient
  async update(id: string, data: Partial<Patient>) {
    return api.put(`/patients/${id}`, data);
  },

  // Delete patient
  async delete(id: string) {
    return api.delete(`/patients/${id}`);
  },

  // Search patients
  async search(query: string) {
    return api.get(`/patients?search=${encodeURIComponent(query)}`);
  },
};
