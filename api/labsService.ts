import api from "./axios";

export const getPatientLabs = async (patientId: string) => {

  const res = await api.get(`/patients/${patientId}/labs`);

  return res.data;

};

export const uploadLab = async (patientId: string, data: any) => {

  const res = await api.post(`/patients/${patientId}/labs`, data);

  return res.data;

};

export const deleteLab = async (patientId: string, labId: string) => {

  const res = await api.delete(`/patients/${patientId}/labs/${labId}`);

  return res.data;

};