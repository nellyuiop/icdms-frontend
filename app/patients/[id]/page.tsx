"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Mock data directly in the file
const mockPatients = [
  {
    id: "P-1001",
    name: "John Smith",
    dob: "1985-06-15",
    phone: "(555) 123-4567",
    email: "john.smith@email.com",
    address: "123 Main St",
    lastVisit: "2026-02-10",
    provider: "Dr. Williams",
    bloodType: "O+",
    allergies: ["Penicillin"],
  },
  {
    id: "P-1002",
    name: "Maria Garcia",
    dob: "1978-11-23",
    phone: "(555) 234-5678",
    email: "maria.garcia@email.com",
    address: "456 Oak Ave",
    lastVisit: "2026-02-12",
    provider: "Dr. Chen",
    bloodType: "A-",
    allergies: ["Sulfa"],
  },
];

export default function PatientProfilePage() {
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = mockPatients.find((p) => p.id === patientId);
    setPatient(found || null);
    setLoading(false);
  }, [patientId]);

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;

  if (!patient) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Patient Not Found</h1>
        <Link href="/patients">Back to Patients</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 0" }}>
      {/* Patient Header Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #0b2b4a 0%, #1a4b76 100%)",
          color: "white",
          padding: "2rem",
          borderRadius: "16px",
          marginBottom: "2rem",
          boxShadow: "0 8px 20px rgba(0,40,80,0.2)",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          {patient.name}
        </h1>
        <p style={{ opacity: 0.9, fontSize: "1.1rem" }}>
          Patient ID: {patient.id}
        </p>
      </div>

      {/* Patient Details Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Demographics Card */}
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              color: "#0b2b4a",
              marginBottom: "1.5rem",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            Demographics
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <strong
                style={{
                  color: "#6b7280",
                  width: "100px",
                  display: "inline-block",
                }}
              >
                DOB:
              </strong>{" "}
              {patient.dob}
            </div>
            <div>
              <strong
                style={{
                  color: "#6b7280",
                  width: "100px",
                  display: "inline-block",
                }}
              >
                Phone:
              </strong>{" "}
              {patient.phone}
            </div>
            <div>
              <strong
                style={{
                  color: "#6b7280",
                  width: "100px",
                  display: "inline-block",
                }}
              >
                Email:
              </strong>{" "}
              {patient.email}
            </div>
            <div>
              <strong
                style={{
                  color: "#6b7280",
                  width: "100px",
                  display: "inline-block",
                }}
              >
                Address:
              </strong>{" "}
              {patient.address}
            </div>
          </div>
        </div>

        {/* Medical Info Card */}
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              color: "#0b2b4a",
              marginBottom: "1.5rem",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            Medical Information
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <strong
                style={{
                  color: "#6b7280",
                  width: "120px",
                  display: "inline-block",
                }}
              >
                Provider:
              </strong>{" "}
              {patient.provider}
            </div>
            <div>
              <strong
                style={{
                  color: "#6b7280",
                  width: "120px",
                  display: "inline-block",
                }}
              >
                Last Visit:
              </strong>{" "}
              {patient.lastVisit}
            </div>
            <div>
              <strong
                style={{
                  color: "#6b7280",
                  width: "120px",
                  display: "inline-block",
                }}
              >
                Blood Type:
              </strong>{" "}
              {patient.bloodType || "Not recorded"}
            </div>
            <div>
              <strong
                style={{
                  color: "#6b7280",
                  width: "120px",
                  display: "inline-block",
                }}
              >
                Allergies:
              </strong>{" "}
              {patient.allergies?.length
                ? patient.allergies.join(", ")
                : "None"}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link
          href={`/patients/${patientId}/visits`}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#0b2b4a",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(11,43,74,0.3)",
          }}
        >
          View Visit History
        </Link>
        <Link
          href={`/patients/${patientId}/visits/new`}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#10b981",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "500",
          }}
        >
          Add New Visit
        </Link>
        <Link
          href="/patients"
          style={{
            padding: "0.75rem 1.5rem",
            background: "#f3f4f6",
            color: "#4b5563",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "500",
          }}
        >
          ← Back to Patients
        </Link>
      </div>
    </div>
  );
}
