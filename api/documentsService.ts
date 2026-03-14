import api from "axios";

export interface PatientDocumentCreateRequest {
  type: string;
  fileName: string;
  fileUrl: string;
}

export const getDocuments = async (patientId: string) => {
  const res = await api.get(`/patients/${patientId}/documents`);
  return res.data;
};

export const uploadDocument = async (
  patientId: string,
  data: PatientDocumentCreateRequest
) => {
  const res = await api.post(`/patients/${patientId}/documents`, data);
  return res.data;
};

export const deleteDocument = async (patientId: string, documentId: string) => {
  const res = await api.delete(
    `/patients/${patientId}/documents/${documentId}`
  );
  return res.data;
};