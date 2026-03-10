"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Mock data
const mockPatients = [
  {
    id: "P-1001",
    name: "John Smith",
    dob: "1985-06-15",
    phone: "(555) 123-4567",
    email: "john.smith@email.com",
    address: "123 Main St, Anytown, USA",
    lastVisit: "2026-02-10",
    provider: "Dr. Williams",
    
  },
  {
    id: "P-1002",
    name: "Maria Garcia",
    dob: "1978-11-23",
    phone: "(555) 234-5678",
    email: "maria.garcia@email.com",
    address: "456 Oak Ave, Somewhere, USA",
    lastVisit: "2026-02-12",
    provider: "Dr. Chen",
   
  },
  {
  id: "P-1003",
  name: "Ali Hassan",
  dob: "1992-03-08",
  phone: "(555) 345-7890",
  email: "ali.hassan@email.com",
  address: "789 Cedar Rd, Dallas, USA",
  lastVisit: "2026-02-14",
  provider: "Dr. Patel",
  
},
{
  id: "P-1004",
  name: "Emma Brown",
  dob: "1989-09-30",
  phone: "(555) 456-8901",
  email: "emma.brown@email.com",
  address: "321 Pine St, Chicago, USA",
  lastVisit: "2026-02-15",
  provider: "Dr. Williams",
  
},
{
  id: "P-1006",
  name: "Sophia Martinez",
  dob: "1995-05-22",
  phone: "(555) 678-0123",
  email: "sophia.martinez@email.com",
  address: "987 Maple Ave, Seattle, USA",
  lastVisit: "2026-02-20",
  provider: "Dr. Patel",
  
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

  if (loading) return <div className="loading">Loading patient profile...</div>;
  if (!patient) return <div className="error">Patient not found</div>;

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      {/* Patient Header */}
      <div className="profile-header">
        <h1>{patient.name}</h1>
        <p className="patient-id">Patient ID: {patient.id}</p>
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
        <div className="card">
          <h2
            style={{
              color: "var(--primary)",
              marginBottom: "1.5rem",
              fontSize: "1.2rem",
            }}
          >
            Demographics
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <strong style={{ color: "var(--gray)", width: "100px", display: "inline-block" }}>
                DOB:
              </strong>{" "}
              {patient.dob}
            </div>

            <div>
              <strong style={{ color: "var(--gray)", width: "100px", display: "inline-block" }}>
                Phone:
              </strong>{" "}
              {patient.phone}
            </div>

            <div>
              <strong style={{ color: "var(--gray)", width: "100px", display: "inline-block" }}>
                Email:
              </strong>{" "}
              {patient.email}
            </div>

            <div>
              <strong style={{ color: "var(--gray)", width: "100px", display: "inline-block" }}>
                Address:
              </strong>{" "}
              {patient.address}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link href={`/patients/${patientId}/visits`} className="btn btn-primary">
          View Visit History
        </Link>

        <Link href={`/patients/${patientId}/visits/new`} className="btn btn-secondary">
          Add New Visit
        </Link>

        <Link href={`/patients/${patientId}/vitals`} className="btn btn-primary">
          View Vitals
        </Link>

        <Link href={`/patients/${patientId}/documents`} className="btn btn-secondary">
          Documents
        </Link>

        <Link href="/patients" className="btn btn-outline">
          ← Back to Patients
        </Link>
      </div>
    </div>
  );
}
