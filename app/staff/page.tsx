"use client";

import { useState } from "react";
import Link from "next/link";

export default function StaffDashboard() {
  const [date] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  );

  const todaysAppointments = [
    {
      id: 1,
      time: "09:00 AM",
      patient: "Sara Haddad",
      type: "Check-up",
      status: "scheduled",
    },
    {
      id: 2,
      time: "10:30 AM",
      patient: "Ali Mansour",
      type: "Follow-up",
      status: "checked-in",
    },
    {
      id: 3,
      time: "11:30 AM",
      patient: "Rami Khalil",
      type: "New Patient",
      status: "scheduled",
    },
  ];

  const statusStyle = (status: string) => {
    if (status === "checked-in") {
      return { background: "#d1fae5", color: "#065f46" };
    }
    return { background: "#fef3c7", color: "#b45309" };
  };

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <div
        style={{
          background:
            "linear-gradient(135deg, #0b2b4a 0%, #1a4b76 50%, #2563eb 100%)",
          color: "white",
          padding: "2rem",
          borderRadius: "16px",
          marginBottom: "2rem",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "0.4rem", fontWeight: 700 }}>
          Welcome back, Maya
        </h1>
        <p style={{ opacity: 0.9 }}>{date} · Reception Staff</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <svg width="40" height="40" fill="#0b2b4a" viewBox="0 0 24 24">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V9h14v11z" />
          </svg>

          <div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#0b2b4a",
              }}
            >
              {todaysAppointments.length}
            </div>
            <div style={{ color: "#6b7280" }}>Today's Appointments</div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", color: "#0b2b4a" }}>
            Today's Schedule
          </h2>

          <Link
            href="/staff/appointments"
            style={{
              color: "#0b2b4a",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            Manage Appointments →
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={thStyle}>Time</th>
                <th style={thStyle}>Patient</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todaysAppointments.map((apt) => (
                <tr key={apt.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{apt.time}</td>
                  <td style={tdStyle}>{apt.patient}</td>
                  <td style={{ ...tdStyle, color: "#6b7280" }}>{apt.type}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        ...statusStyle(apt.status),
                      }}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {apt.status === "checked-in" ? (
                      <span
                        style={{
                          padding: "0.35rem 0.8rem",
                          background: "#d1fae5",
                          color: "#065f46",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        Checked In
                      </span>
                    ) : (
                      <button
                        style={{
                          padding: "0.35rem 0.8rem",
                          background: "#0b2b4a",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        Check In
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
        }}
      >
        <Link href="/staff/patients/new" style={actionCardStyle}>
          Register New Patient
        </Link>

        <Link href="/staff/appointments/new" style={actionCardStyle}>
          Schedule Appointment
        </Link>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "0.75rem",
  textAlign: "left" as const,
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#6b7280",
};

const tdStyle = {
  padding: "0.75rem",
  fontSize: "0.9rem",
  color: "#374151",
};

const actionCardStyle = {
  padding: "1rem",
  background: "white",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  textDecoration: "none",
  color: "#0b2b4a",
  textAlign: "center" as const,
};