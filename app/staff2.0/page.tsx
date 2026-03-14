// staff/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getEncounters, EncounterVisit, EncounterVisitStatus } from "@/api/encountersService";
import Link from "next/link";

export default function StaffDashboard() {
  const [date] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  const [todaysAppointments, setTodaysAppointments] = useState<EncounterVisit[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const encounters: EncounterVisit[] = await getEncounters();
        const today = new Date().toISOString().slice(0, 10);
        setTodaysAppointments(encounters.filter((e) => e.visit_date.slice(0, 10) === today));
      } catch (err) {
        console.error("Failed to fetch encounters:", err);
      }
    };
    fetchData();
  }, []);

  const statusStyle = (status: EncounterVisitStatus) => {
    if (status === "CHECKED_IN") return { background: "#d1fae5", color: "#065f46" };
    return { background: "#fef3c7", color: "#b45309" };
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ background: "#2563eb", color: "white", padding: "2rem", borderRadius: 16 }}>
        <h1>Welcome back, Maya</h1>
        <p>{date} · Reception Staff</p>
      </div>

      <div style={{ margin: "2rem 0" }}>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ background: "white", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <h2>Today's Appointments: {todaysAppointments.length}</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Time</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Patient</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {todaysAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td style={{ padding: "0.5rem" }}>
                      {new Date(apt.visit_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      {apt.patient.firstName} {apt.patient.lastName}
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: 999,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          ...statusStyle(apt.status),
                        }}
                      >
                        {apt.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        <Link
          href="/staff/patients/new"
          style={{ padding: 16, background: "white", borderRadius: 8, textDecoration: "none", color: "#0b2b4a" }}
        >
          Register New Patient
        </Link>
        <Link
          href="/staff/appointments/new"
          style={{ padding: 16, background: "white", borderRadius: 8, textDecoration: "none", color: "#0b2b4a" }}
        >
          Schedule Appointment
        </Link>
      </div>
    </div>
  );
}