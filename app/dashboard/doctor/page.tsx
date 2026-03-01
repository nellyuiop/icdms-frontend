// app/dashboard/doctor/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  reason: string;
  status: "scheduled" | "in-progress" | "completed";
}

export default function DoctorDashboard() {
  const [doctorName] = useState("Dr. Rami Haddad");
  const [hoveredAptId, setHoveredAptId] = useState<string | null>(null);
  const [isStatsHover, setIsStatsHover] = useState(false);

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const todaysAppointments: Appointment[] = [
    {
      id: "1",
      patientName: "John Smith",
      patientId: "P-1001",
      time: "09:00 AM",
      reason: "Follow-up",
      status: "scheduled",
    },
    {
      id: "2",
      patientName: "Maria Garcia",
      patientId: "P-1002",
      time: "10:30 AM",
      reason: "Check-up",
      status: "scheduled",
    },
  ];

  const stats = [
    {
      label: "Today's Appointments",
      value: todaysAppointments.length.toString(),
    },
  ];

  const statusPillStyle = (status: Appointment["status"]) => {
    if (status === "scheduled") {
      return {
        background: "#fef3c7",
        color: "#b45309",
        border: "1px solid #f59e0b33",
      }; // yellow
    }
    if (status === "in-progress") {
      return {
        background: "#dbeafe",
        color: "#1e40af",
        border: "1px solid #3b82f633",
      }; // blue
    }
    return {
      background: "#d1fae5",
      color: "#065f46",
      border: "1px solid #10b98133",
    }; // green
  };

  const statusAccentColor = (status: Appointment["status"]) => {
    if (status === "scheduled") return "#f59e0b";
    if (status === "in-progress") return "#3b82f6";
    return "#10b981";
  };

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      {/* Welcome Header */}
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
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Welcome back, {doctorName}
        </h1>
        <p style={{ opacity: 0.9 }}>{todayDate}</p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            onMouseEnter={() => setIsStatsHover(true)}
            onMouseLeave={() => setIsStatsHover(false)}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              transform: isStatsHover ? "translateY(-3px)" : "translateY(0)",
            }}
          >
            {/* Professional Calendar SVG */}
            <svg width="40" height="40" fill="#0b2b4a" viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V9h14v11z" />
            </svg>

            <div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#0b2b4a",
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </div>
              <div style={{ color: "#6b7280" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
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
        {/* header row with link */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", color: "#0b2b4a", margin: 0 }}>
            Today's Schedule
          </h2>

          <Link
            href="/appointments"
            style={{
              color: "#0b2b4a",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            View Full Schedule →
          </Link>
        </div>

        {todaysAppointments.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "#6b7280",
              borderRadius: "10px",
              background: "#f9fafb",
              border: "1px dashed #e5e7eb",
            }}
          >
            No appointments scheduled today.
          </div>
        ) : (
          todaysAppointments.map((apt) => {
            const isHover = hoveredAptId === apt.id;

            return (
              <div
                key={apt.id}
                onMouseEnter={() => setHoveredAptId(apt.id)}
                onMouseLeave={() => setHoveredAptId(null)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                  transition: "background 0.2s ease, transform 0.2s ease",
                  background: isHover ? "#f9fafb" : "white",
                  cursor: "default",
                }}
              >
                {/* Left side with accent bar */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div
                    style={{
                      width: "4px",
                      height: "50px",
                      borderRadius: "4px",
                      background: statusAccentColor(apt.status),
                      opacity: 0.9,
                    }}
                  />

                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                      <strong style={{ color: "#0b2b4a" }}>{apt.time}</strong>
                      <Link
                        href={`/patients/${apt.patientId}`}
                        style={{
                          color: "#0b2b4a",
                          textDecoration: "none",
                          fontWeight: 700,
                        }}
                      >
                        {apt.patientName}
                      </Link>
                    </div>

                    {/* Follow-up under the name */}
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: apt.reason === "Follow-up" ? "#b45309" : "#6b7280",
                        fontWeight: apt.reason === "Follow-up" ? 600 : 400,
                        marginTop: "0.15rem",
                      }}
                    >
                      {apt.reason}
                    </div>
                  </div>
                </div>

                {/* Right side status pill */}
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "capitalize",
                    whiteSpace: "nowrap",
                    ...statusPillStyle(apt.status),
                  }}
                >
                  {apt.status}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Recent Patients */}
      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ fontSize: "1.3rem", color: "#0b2b4a", marginBottom: "1rem" }}>
          Recent Patients
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Patient ID</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Name</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Last Visit</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "0.75rem" }}>P-1001</td>
              <td style={{ padding: "0.75rem" }}>John Smith</td>
              <td style={{ padding: "0.75rem" }}>2026-02-10</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}