// app/dashboard/doctor/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  reason: string;
  status: "scheduled" | "in-progress" | "completed";
}

interface PendingLab {
  id: string;
  patientName: string;
  patientId: string;
  testType: string;
  date: string;
  priority: "normal" | "urgent";
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [doctorName, setDoctorName] = useState("Dr. Rami Haddad");
  const [todayDate] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  );

  // Mock data - replace with API calls
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
    {
      id: "3",
      patientName: "Robert Johnson",
      patientId: "P-1003",
      time: "01:00 PM",
      reason: "Consultation",
      status: "scheduled",
    },
    {
      id: "4",
      patientName: "Sarah Lee",
      patientId: "P-1004",
      time: "02:30 PM",
      reason: "Lab Results Review",
      status: "scheduled",
    },
  ];

  const pendingLabs: PendingLab[] = [
    {
      id: "L1",
      patientName: "John Smith",
      patientId: "P-1001",
      testType: "Blood Work",
      date: "2026-02-18",
      priority: "urgent",
    },
    {
      id: "L2",
      patientName: "Maria Garcia",
      patientId: "P-1002",
      testType: "X-Ray",
      date: "2026-02-17",
      priority: "normal",
    },
    {
      id: "L3",
      patientName: "Robert Johnson",
      patientId: "P-1003",
      testType: "MRI",
      date: "2026-02-16",
      priority: "urgent",
    },
  ];

  const recentPatients = [
    {
      id: "P-1001",
      name: "John Smith",
      lastVisit: "2026-02-10",
      vitals: "120/80, 72 bpm",
    },
    {
      id: "P-1002",
      name: "Maria Garcia",
      lastVisit: "2026-02-12",
      vitals: "118/75, 68 bpm",
    },
    {
      id: "P-1005",
      name: "James Wilson",
      lastVisit: "2026-02-15",
      vitals: "130/85, 76 bpm",
    },
  ];

  // Stats for doctor
  const stats = [
    {
      label: "Today's Appointments",
      value: todaysAppointments.length.toString(),
      icon: "📅",
      color: "#0b2b4a",
    },
    {
      label: "Pending Labs",
      value: pendingLabs.length.toString(),
      icon: "🔬",
      color: "#d97706",
    },
    { label: "Total Patients", value: "1,247", icon: "👥", color: "#059669" },
    { label: "AI Summaries", value: "12", icon: "🤖", color: "#7c3aed" },
  ];

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      {/* Welcome Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0b2b4a, #1a4b76)",
          color: "white",
          padding: "2rem",
          borderRadius: "16px",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            Welcome back, {doctorName}
          </h1>
          <p style={{ opacity: 0.9 }}>{todayDate}</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            style={{
              padding: "0.75rem 1.5rem",
              background: "white",
              color: "#0b2b4a",
              border: "none",
              borderRadius: "8px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            🤖 AI Copilot
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              {stat.icon}
            </div>
            <div
              style={{ fontSize: "2rem", fontWeight: "600", color: stat.color }}
            >
              {stat.value}
            </div>
            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Left Column - Today's Schedule */}
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
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

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {todaysAppointments.map((apt) => (
              <div
                key={apt.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#0b2b4a",
                      minWidth: "80px",
                    }}
                  >
                    {apt.time}
                  </span>
                  <div>
                    <Link
                      href={`/patients/${apt.patientId}`}
                      style={{
                        fontWeight: "500",
                        color: "#0b2b4a",
                        textDecoration: "none",
                      }}
                    >
                      {apt.patientName}
                    </Link>
                    <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                      {apt.reason}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    background:
                      apt.status === "scheduled" ? "#fef3c7" : "#d1fae5",
                    color: apt.status === "scheduled" ? "#b45309" : "#065f46",
                  }}
                >
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Pending Labs */}
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.3rem",
              color: "#0b2b4a",
              marginBottom: "1.5rem",
            }}
          >
            Pending Labs
          </h2>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {pendingLabs.map((lab) => (
              <div
                key={lab.id}
                style={{
                  padding: "1rem",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Link
                    href={`/patients/${lab.patientId}`}
                    style={{
                      fontWeight: "500",
                      color: "#0b2b4a",
                      textDecoration: "none",
                    }}
                  >
                    {lab.patientName}
                  </Link>
                  {lab.priority === "urgent" && (
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        background: "#fee2e2",
                        color: "#b45309",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: "600",
                      }}
                    >
                      URGENT
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                  {lab.testType}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#9ca3af",
                    marginTop: "0.25rem",
                  }}
                >
                  Received: {lab.date}
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/labs"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "1rem",
              padding: "0.5rem",
              color: "#0b2b4a",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            View All Labs →
          </Link>
        </div>
      </div>

      {/* Recent Patients Section */}
      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
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
            Recent Patients
          </h2>
          <Link
            href="/patients"
            style={{ color: "#0b2b4a", textDecoration: "none" }}
          >
            View All →
          </Link>
        </div>

        <div className="table-container">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>
                  Patient ID
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Name</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>
                  Last Visit
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>
                  Latest Vitals
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((patient) => (
                <tr
                  key={patient.id}
                  style={{ borderBottom: "1px solid #e5e7eb" }}
                >
                  <td style={{ padding: "0.75rem" }}>{patient.id}</td>
                  <td style={{ padding: "0.75rem", fontWeight: "500" }}>
                    {patient.name}
                  </td>
                  <td style={{ padding: "0.75rem", color: "#6b7280" }}>
                    {patient.lastVisit}
                  </td>
                  <td style={{ padding: "0.75rem", color: "#6b7280" }}>
                    {patient.vitals}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <Link
                      href={`/patients/${patient.id}`}
                      style={{
                        padding: "0.4rem 0.8rem",
                        background: "#0b2b4a",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        <Link
          href="/patients/search"
          style={{
            padding: "1rem",
            background: "white",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            textDecoration: "none",
            color: "#0b2b4a",
            textAlign: "center",
          }}
        >
          🔍 Quick Patient Search
        </Link>
        <Link
          href="/visits/new"
          style={{
            padding: "1rem",
            background: "white",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            textDecoration: "none",
            color: "#0b2b4a",
            textAlign: "center",
          }}
        >
          📝 New Visit
        </Link>
        <Link
          href="/ai-assistant"
          style={{
            padding: "1rem",
            background: "white",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            textDecoration: "none",
            color: "#0b2b4a",
            textAlign: "center",
          }}
        >
          🤖 AI Medical Summary
        </Link>
      </div>
    </div>
  );
}
