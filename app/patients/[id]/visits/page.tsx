"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Mock visits data
const mockVisits = [
  {
    id: "V-001",
    patientId: "P-1001",
    date: "2026-02-10",
    reason: "Annual checkup",
    provider: "Dr. Williams",
    notes: "Patient in good health",
  },
  {
    id: "V-002",
    patientId: "P-1001",
    date: "2025-11-15",
    reason: "Flu symptoms",
    provider: "Dr. Williams",
    notes: "Prescribed Tamiflu",
  },
  {
    id: "V-003",
    patientId: "P-1002",
    date: "2026-02-12",
    reason: "Follow-up",
    provider: "Dr. Chen",
    notes: "BP 120/80",
  },
];

export default function VisitHistoryPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter visits for this patient
    const patientVisits = mockVisits.filter((v) => v.patientId === patientId);
    setVisits(patientVisits);
    setLoading(false);
  }, [patientId]);

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1
        style={{ fontSize: "2rem", color: "#2563eb", marginBottom: "0.5rem" }}
      >
        Visit History
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Patient ID: {patientId}
      </p>

      {visits.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "3rem",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ marginBottom: "1rem" }}>
            No visits found for this patient.
          </p>
          <Link
            href={`/patients/${patientId}/visits/new`}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#2563eb",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Add First Visit
          </Link>
        </div>
      ) : (
        <>
          {visits.map((visit) => (
            <div
              key={visit.id}
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                borderLeft: "4px solid #2563eb",
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
        </>
      )}

      <div style={{ marginTop: "2rem" }}>
        <Link
          href={`/patients/${patientId}`}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#6b7280",
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
