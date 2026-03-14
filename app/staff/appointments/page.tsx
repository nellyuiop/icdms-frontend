"use client";
import { useState } from "react";

type Appointment = {
  id: number;
  patient: string;
  date: string;
  status: "scheduled" | "completed";
};

export default function StaffAppointments() {
  const [appointments] = useState<Appointment[]>([
    { id: 1, patient: "Sara Haddad", date: "2026-02-28", status: "scheduled" },
    { id: 2, patient: "Ali Mansour", date: "2026-02-26", status: "completed" },
  ]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Staff - Appointments</h1>

      <table style={{ marginTop: "2rem", width: "100%" }}>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td>{a.patient}</td>
              <td>{a.date}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}