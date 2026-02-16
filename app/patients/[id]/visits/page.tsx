"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function VisitHistoryPage() {
  const params = useParams();
  const patientId = params.id as string;

  // Mock visits data
  const mockVisits = [
    {
      id: "V-001",
      date: "2026-02-10",
      reason: "Annual checkup",
      provider: "Dr. Williams",
      notes: "Patient in good health",
    },
    {
      id: "V-002",
      date: "2025-11-15",
      reason: "Flu symptoms",
      provider: "Dr. Williams",
      notes: "Prescribed Tamiflu",
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1
        style={{ fontSize: "2rem", color: "#0b2b4a", marginBottom: "0.5rem" }}
      >
        Visit History
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Patient ID: {patientId}
      </p>

      {mockVisits.map((visit) => (
        <div
          key={visit.id}
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #0b2b4a",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
            {visit.date}
          </p>
          <p>
            <strong>Reason:</strong> {visit.reason}
          </p>
          <p>
            <strong>Provider:</strong> {visit.provider}
          </p>
          {visit.notes && (
            <p>
              <strong>Notes:</strong> {visit.notes}
            </p>
          )}
        </div>
      ))}

      <div style={{ marginTop: "2rem" }}>
        <Link
          href={`/patients/${patientId}`}
          style={{
            padding: "0.5rem 1rem",
            background: "#0b2b4a",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          ← Back to Profile
        </Link>
      </div>
    </div>
  );
}
