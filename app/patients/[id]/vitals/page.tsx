"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function PatientVitalsPage() {
  const params = useParams();
  const patientId = params.id as string;

  // Mock patient data - replace with real data later
  const patientName = "John Smith";

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{ fontSize: "2rem", color: "#0b2b4a", marginBottom: "0.5rem" }}
        >
          Patient Vitals
        </h1>
        <p style={{ color: "#6b7280" }}>
          {patientName} · Patient ID: {patientId}
        </p>
      </div>

      {/* Vitals Grid - Simple clean cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {/* Blood Pressure */}
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
              color: "#4b5563",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            Blood Pressure
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: "600", color: "#0b2b4a" }}
          >
            120/80
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>mmHg</div>
        </div>

        {/* Heart Rate */}
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
              color: "#4b5563",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            Heart Rate
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: "600", color: "#0b2b4a" }}
          >
            72
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>bpm</div>
        </div>

        {/* Temperature */}
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
              color: "#4b5563",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            Temperature
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: "600", color: "#0b2b4a" }}
          >
            98.6°F
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>37°C</div>
        </div>

        {/* Respiratory Rate */}
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
              color: "#4b5563",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            Respiratory Rate
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: "600", color: "#0b2b4a" }}
          >
            16
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
            breaths/min
          </div>
        </div>

        {/* Oxygen Saturation */}
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
            gridColumn: "span 2",
          }}
        >
          <div
            style={{
              color: "#4b5563",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            Oxygen Saturation
          </div>
          <div
            style={{ fontSize: "2rem", fontWeight: "600", color: "#0b2b4a" }}
          >
            98%
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>SpO2</div>
        </div>
      </div>

      {/* Back Button */}
      <Link
        href={`/patients/${patientId}`}
        style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          background: "#0b2b4a",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "500",
        }}
      >
        ← Back to Profile
      </Link>
    </div>
  );
}
