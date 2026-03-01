"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PatientVisitsPage() {
  const params = useParams();
  const patientId = params.id as string;
  const [filter, setFilter] = useState("all");

  // Mock visits for this patient
  const patientVisits = [
    {
      id: "V-001",
      date: "2026-03-15",
      time: "09:00 AM",
      reason: "Follow-up",
      provider: "Dr. Williams",
      status: "scheduled",
      vitals: null,
    },
    {
      id: "V-003",
      date: "2026-02-10",
      time: "11:30 AM",
      reason: "Annual checkup",
      provider: "Dr. Williams",
      status: "completed",
      vitals: {
        bp: "120/80",
        hr: "72",
        temp: "98.6°F",
        rr: "16",
        spo2: "98%",
      },
    },
    {
      id: "V-004",
      date: "2025-11-15",
      time: "02:00 PM",
      reason: "Flu symptoms",
      provider: "Dr. Williams",
      status: "completed",
      vitals: {
        bp: "118/75",
        hr: "68",
        temp: "99.1°F",
        rr: "18",
        spo2: "97%",
      },
    },
  ];

  const filteredVisits =
    filter === "all"
      ? patientVisits
      : patientVisits.filter((v) => v.status === filter);

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", color: "#0b2b4a" }}>Patient Visits</h1>
        <Link href={`/patients/${patientId}`} style={{ color: "#0b2b4a" }}>
          ← Back to Profile
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
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
          All
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
          Upcoming
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

      {/* Visits List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filteredVisits.map((visit) => (
          <div
            key={visit.id}
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
                marginBottom: "1rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#0b2b4a",
                  }}
                >
                  {visit.date} at {visit.time}
                </span>
                <span
                  style={{
                    marginLeft: "1rem",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    background:
                      visit.status === "completed" ? "#d1fae5" : "#fef3c7",
                    color: visit.status === "completed" ? "#065f46" : "#b45309",
                  }}
                >
                  {visit.status}
                </span>
              </div>
              {visit.status === "scheduled" && (
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Check In
                </button>
              )}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <div>
                <strong>Reason:</strong> {visit.reason}
              </div>
              <div>
                <strong>Provider:</strong> {visit.provider}
              </div>
            </div>

            {/* Vitals for completed visits */}
            {visit.status === "completed" && visit.vitals && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "#f9fafb",
                  borderRadius: "8px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    color: "#0b2b4a",
                    marginBottom: "0.75rem",
                  }}
                >
                  Vital Signs
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <strong>BP:</strong> {visit.vitals.bp}
                  </div>
                  <div>
                    <strong>HR:</strong> {visit.vitals.hr}
                  </div>
                  <div>
                    <strong>Temp:</strong> {visit.vitals.temp}
                  </div>
                  <div>
                    <strong>RR:</strong> {visit.vitals.rr}
                  </div>
                  <div>
                    <strong>SpO2:</strong> {visit.vitals.spo2}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Schedule New Button */}
      <div style={{ marginTop: "2rem" }}>
        <Link
          href={`/patients/${patientId}/visits/new`}
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
