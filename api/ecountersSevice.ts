import api from "./axios";

export const createEncounter = async (data: any) => {

  const res = await api.post("/encounters", data);

  return res.data;

};

export const getEncounters = async () => {

  const res = await api.get("/encounters");

  return res.data;

};

export const updateEncounterStatus = async (id: string, status: string) => {

  const res = await api.patch(`/encounters/${id}/status`, {
    status,
  });

  return res.data;

};