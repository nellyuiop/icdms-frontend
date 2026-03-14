// staff/api/encounterService.ts
import api from "axios";

export type EncounterVisitStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface EncounterPatient {
  id: string;
  firstName: string;
  lastName: string;
}

export interface EncounterClinician {
  id: string;
  name: string;
  email: string;
}

export interface EncounterVisit {
  id: string;
  patient_id: string;
  clinician_user_id: string;
  visit_date: string;
  reason?: string;
  notes?: string;
  status: EncounterVisitStatus;
  patient: EncounterPatient;
  clinician: EncounterClinician;
}

export interface CreateVisitRequest {
  patientId: string;
  clinicianUserId: string;
  visitDate: string;
  reason?: string;
}

export interface UpdateVisitStatusRequest {
  status: EncounterVisitStatus;
  notes?: string;
}

export const createEncounter = async (data: CreateVisitRequest): Promise<EncounterVisit> => {
  const res = await api.post("/encounters", data);
  return res.data;
};

export const getEncounters = async (): Promise<EncounterVisit[]> => {
  const res = await api.get("/encounters");
  return res.data;
};

export const updateEncounterStatus = async (
  id: string,
  data: UpdateVisitStatusRequest
): Promise<EncounterVisit> => {
  const res = await api.patch(`/encounters/${id}/status`, data);
  return res.data;
};