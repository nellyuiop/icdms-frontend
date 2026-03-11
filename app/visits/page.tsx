"use client";

import { useState } from "react";
import Link from "next/link";

export default function VisitsPage() {
  const [filter, setFilter] = useState("all"); // all, scheduled, completed

  // Mock data - all visits together (appointments + completed visits)
  const allVisits = [
    {
      id: "V-001",
      patientName: "John Smith",
      patientId: "P-1001",
      date: "2026-03-15",
      time: "09:00 AM",
      reason: "Follow-up",
      provider: "Dr. Williams",
      status: "scheduled",
    },
    {
      id: "V-002",
      patientName: "Maria Garcia",
      patientId: "P-1002",
      date: "2026-03-15",
      time: "10:30 AM",
      reason: "Check-up",
      provider: "Dr. Chen",
      status: "scheduled",
    },
    {
      id: "V-003",
      patientName: "Robert Johnson",
      patientId: "P-1003",
      date: "2026-03-14",
      time: "02:00 PM",
      reason: "Consultation",
      provider: "Dr. Williams",
      status: "completed",
    },
    {
      id: "V-004",
      patientName: "Sarah Lee",
      patientId: "P-1004",
      date: "2026-03-14",
      time: "11:00 AM",
      reason: "Lab Results",
      provider: "Dr. Patel",
      status: "completed",
    },
    {
      id: "V-005",
      patientName: "James Wilson",
      patientId: "P-1005",
      date: "2026-03-16",
      time: "01:30 PM",
      reason: "Annual physical",
      provider: "Dr. Chen",
      status: "scheduled",
    },
  ];

  const filteredVisits =
    filter === "all" ? allVisits : allVisits.filter((v) => v.status === filter);

  const scheduledCount = allVisits.filter(
    (v) => v.status === "scheduled",
  ).length;
  const completedCount = allVisits.filter(
    (v) => v.status === "completed",
  ).length;

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
          Visits & Appointments
        </h1>
        <p style={{ opacity: 0.9 }}>Manage all patient visits in one place</p>
      </div>

      {/* Stats */}
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
          <div
            style={{ fontSize: "2rem", fontWeight: "600", color: "#0b2b4a" }}
          >
            {allVisits.length}
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            Total Visits
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
          <div
            style={{ fontSize: "2rem", fontWeight: "600", color: "#d97706" }}
          >
            {scheduledCount}
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Scheduled</div>
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
          <div
            style={{ fontSize: "2rem", fontWeight: "600", color: "#059669" }}
          >
            {completedCount}
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Completed</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: "1rem",
        }}
      >
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "0.5rem 1.5rem",
            background: filter === "all" ? "#0b2b4a" : "white",
            color: filter === "all" ? "white" : "#4b5563",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          All Visits
        </button>
        <button
          onClick={() => setFilter("scheduled")}
          style={{
            padding: "0.5rem 1.5rem",
            background: filter === "scheduled" ? "#d97706" : "white",
            color: filter === "scheduled" ? "white" : "#4b5563",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          Scheduled
        </button>
        <button
          onClick={() => setFilter("completed")}
          style={{
            padding: "0.5rem 1.5rem",
            background: filter === "completed" ? "#059669" : "white",
            color: filter === "completed" ? "white" : "#4b5563",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          Completed
        </button>
      </div>

      {/* Visits Table */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={{ padding: "1rem", textAlign: "left" }}>
                Date & Time
              </th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Patient</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Reason</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Provider</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisits.map((visit) => (
              <tr key={visit.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "1rem" }}>
                  <div style={{ fontWeight: "500" }}>{visit.date}</div>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                    {visit.time}
                  </div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <Link
                    href={`/patients/${visit.patientId}`}
                    style={{ color: "#0b2b4a", textDecoration: "none" }}
                  >
                    {visit.patientName}
                  </Link>
                </td>
                <td style={{ padding: "1rem" }}>{visit.reason}</td>
                <td style={{ padding: "1rem" }}>{visit.provider}</td>
                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      background:
                        visit.status === "completed" ? "#d1fae5" : "#fef3c7",
                      color:
                        visit.status === "completed" ? "#065f46" : "#b45309",
                    }}
                  >
                    {visit.status}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  {visit.status === "scheduled" ? (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        style={{
                          padding: "0.4rem 0.8rem",
                          background: "#059669",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Check In
                      </button>
                      <Link
                        href={`/visits/${visit.id}/edit`}
                        style={{
                          padding: "0.4rem 0.8rem",
                          background: "#0b2b4a",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "4px",
                        }}
                      >
                        Edit
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={`/visits/${visit.id}`}
                      style={{
                        padding: "0.4rem 0.8rem",
                        background: "#0b2b4a",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "4px",
                      }}
                    >
                      View Details
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: "2rem" }}>
        <Link
          href="/visits/new"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            background: "#0b2b4a",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
          }}
        >
          + Schedule New Visit
        </Link>
      </div>
    </div>
  );
}
