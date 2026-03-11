// app/appointments/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  date: string;
  reason: string;
  status: "scheduled" | "in-progress" | "completed";
}

export default function FullSchedulePage() {
  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "John Smith",
      patientId: "P-1001",
      time: "09:00 AM",
      date: "2026-03-01",
      reason: "Follow-up",
      status: "scheduled",
    },
    {
      id: "2",
      patientName: "Maria Garcia",
      patientId: "P-1002",
      time: "10:30 AM",
      date: "2026-03-01",
      reason: "Check-up",
      status: "in-progress",
    },
    {
      id: "3",
      patientName: "Robert Johnson",
      patientId: "P-1003",
      time: "01:00 PM",
      date: "2026-03-01",
      reason: "Consultation",
      status: "completed",
    },
  ]);

  const statusColor = (status: string) => {
    if (status === "scheduled") return "#f59e0b";
    if (status === "in-progress") return "#3b82f6";
    return "#10b981";
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", color: "#0b2b4a" }}>
          Full Schedule
        </h1>

        <Link
          href="/dashboard/doctor"
          style={{
            textDecoration: "none",
            color: "#0b2b4a",
            fontWeight: 500,
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Table */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Reason</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((apt) => (
              <tr
                key={apt.id}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  transition: "background 0.2s ease",
                }}
              >
                <td style={tdStyle}>{apt.date}</td>
                <td style={tdStyle}>{apt.time}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>
                  <Link
                    href={`/patients/${apt.patientId}`}
                    style={{
                      textDecoration: "none",
                      color: "#0b2b4a",
                    }}
                  >
                    {apt.patientName}
                  </Link>
                </td>
                <td style={tdStyle}>{apt.reason}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "0.3rem 0.8rem",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      background: `${statusColor(apt.status)}22`,
                      color: statusColor(apt.status),
                      textTransform: "capitalize",
                    }}
                  >
                    {apt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "1rem",
  textAlign: "left" as const,
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#6b7280",
};

const tdStyle = {
  padding: "1rem",
  fontSize: "0.9rem",
  color: "#374151",
};