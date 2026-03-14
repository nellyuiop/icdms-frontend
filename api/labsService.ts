import api from "axios";

export interface LabUploadRequest {
  testName: string;
  result: string;
  unit?: string;
  referenceRange?: string;
  status?: string;
  notes?: string;
}

export const getPatientLabs = async (patientId: string) => {
  const res = await api.get(`/patients/${patientId}/labs`);
  return res.data;
};

export const uploadLab = async (patientId: string, data: LabUploadRequest) => {
  const res = await api.post(`/patients/${patientId}/labs`, data);
  return res.data;
};

export const deleteLab = async (patientId: string, labId: string) => {
  const res = await api.delete(`/patients/${patientId}/labs/${labId}`);
  return res.data;
};