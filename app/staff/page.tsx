// app/staff/page.tsx
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

  // Mock data - today's appointments
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
    {
      id: 4,
      time: "02:00 PM",
      patient: "Nadine Salem",
      type: "Consultation",
      status: "scheduled",
    },
  ];

  // Recent registrations
  const recentRegistrations = [
    { id: "P-1024", name: "Omar Farhat", date: "2026-03-01", time: "10:15 AM" },
    { id: "P-1023", name: "Lina Akiki", date: "2026-03-01", time: "09:30 AM" },
    { id: "P-1022", name: "Karim Nader", date: "2026-02-28", time: "04:15 PM" },
  ];

  // Pending documents
  const pendingDocuments = [
    { patient: "Sara Haddad", document: "Insurance Card", status: "urgent" },
    { patient: "Ali Mansour", document: "ID", status: "pending" },
    { patient: "Rami Khalil", document: "Referral Letter", status: "pending" },
  ];

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0b2b4a, #1a4b76)",
          color: "white",
          padding: "2rem",
          borderRadius: "16px",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Welcome, Maya
        </h1>
        <p style={{ opacity: 0.9 }}>
          {date} · Reception & Administrative Staff
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📅</div>
          <div
            style={{ fontSize: "2rem", fontWeight: "600", color: "#0b2b4a" }}
          >
            {todaysAppointments.length}
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            Today's Appointments
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📝</div>
          <div
            style={{ fontSize: "2rem", fontWeight: "600", color: "#0b2b4a" }}
          >
            3
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            Pending Documents
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👤</div>
          <div
            style={{ fontSize: "2rem", fontWeight: "600", color: "#0b2b4a" }}
          >
            3
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            New Registrations Today
          </div>
        </div>
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
        {/* Today's Schedule */}
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
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Time
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Patient
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Type
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Status
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {todaysAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    style={{ borderBottom: "1px solid #e5e7eb" }}
                  >
                    <td style={{ padding: "0.75rem", fontWeight: "500" }}>
                      {apt.time}
                    </td>
                    <td style={{ padding: "0.75rem" }}>{apt.patient}</td>
                    <td style={{ padding: "0.75rem", color: "#6b7280" }}>
                      {apt.type}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          background:
                            apt.status === "checked-in" ? "#d1fae5" : "#fef3c7",
                          color:
                            apt.status === "checked-in" ? "#065f46" : "#b45309",
                        }}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <button
                        style={{
                          padding: "0.25rem 0.5rem",
                          background: "#0b2b4a",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        Check In
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Documents */}
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
            Pending Documents
          </h2>

          {pendingDocuments.map((doc, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                background: "#f9fafb",
                borderRadius: "8px",
                marginBottom: "0.75rem",
              }}
            >
              <div>
                <div style={{ fontWeight: "500" }}>{doc.patient}</div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                  {doc.document}
                </div>
              </div>
              {doc.status === "urgent" ? (
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
              ) : (
                <button
                  style={{
                    padding: "0.25rem 0.75rem",
                    background: "#0b2b4a",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  Upload
                </button>
              )}
            </div>
          ))}

          <Link
            href="/staff/documents"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "1rem",
              color: "#0b2b4a",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            View All Documents →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Link
          href="/staff/patients/new"
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
          ➕ Register New Patient
        </Link>
        <Link
          href="/staff/appointments/new"
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
          📅 Schedule Appointment
        </Link>
        <Link
          href="/staff/documents/upload"
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
          📎 Upload Documents
        </Link>
      </div>

      {/* Recent Registrations */}
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
            Recent Registrations
          </h2>
          <Link
            href="/staff/patients"
            style={{ color: "#0b2b4a", textDecoration: "none" }}
          >
            View All →
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>
                  Patient ID
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Name</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Date</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Time</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentRegistrations.map((reg) => (
                <tr key={reg.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "0.75rem", fontWeight: "500" }}>
                    {reg.id}
                  </td>
                  <td style={{ padding: "0.75rem" }}>{reg.name}</td>
                  <td style={{ padding: "0.75rem", color: "#6b7280" }}>
                    {reg.date}
                  </td>
                  <td style={{ padding: "0.75rem", color: "#6b7280" }}>
                    {reg.time}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <Link
                      href={`/staff/patients/${reg.id}`}
                      style={{
                        padding: "0.25rem 0.75rem",
                        background: "#0b2b4a",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
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
    </div>
  );
}
