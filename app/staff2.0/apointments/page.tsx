"use client";

import { useEffect, useState } from "react";
import { getEncounters, updateEncounterStatus, EncounterVisit, EncounterVisitStatus } from "@/api/encountersService";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<EncounterVisit[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEncounters();
      setAppointments(data);
    };
    fetchData();
  }, []);

  const changeStatus = async (id: string, status: EncounterVisitStatus) => {
    await updateEncounterStatus(id, { status });
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Appointments</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Clinician</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt.id}>
              <td>{apt.patient.firstName} {apt.patient.lastName}</td>
              <td>{apt.clinician.name}</td>
              <td>{new Date(apt.visit_date).toLocaleString()}</td>
              <td>{apt.status}</td>
              <td>
                <button onClick={() => changeStatus(apt.id, "CHECKED_IN")}>Check-in</button>
                <button onClick={() => changeStatus(apt.id, "CANCELLED")}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}