import api from "./axios";

export const addVitals = async (encounterId: string, data: any) => {

  const res = await api.post(`/encounters/${encounterId}/vitals`, data);

  return res.data;

};

export const getEncounterVitals = async (encounterId: string) => {

  const res = await api.get(`/encounters/${encounterId}/vitals`);

  return res.data;

};

export const getPatientVitals = async (patientId: string) => {

  const res = await api.get(`/patients/${patientId}/vitals`);

  return res.data;

};