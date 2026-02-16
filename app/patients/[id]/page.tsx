"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PatientProfilePage() {
  const params = useParams();
  const patientId = params.id as string;

  // Mock data inside the file
  const mockPatients = [
    {
      id: "P-1001",
      name: "John Smith",
      dob: "1985-06-15",
      phone: "(555) 123-4567",
      email: "john.smith@email.com",
      provider: "Dr. Williams",
    },
    {
      id: "P-1002",
      name: "Maria Garcia",
      dob: "1978-11-23",
      phone: "(555) 234-5678",
      email: "maria.garcia@email.com",
      provider: "Dr. Chen",
    },
  ];

  const patient = mockPatients.find((p) => p.id === patientId);

  if (!patient) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Patient Not Found</h1>
        <Link href="/patients">Back to Patients</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", color: "#0b2b4a" }}>{patient.name}</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Patient ID: {patient.id}
      </p>

      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <p>
          <strong>Date of Birth:</strong> {patient.dob}
        </p>
        <p>
          <strong>Phone:</strong> {patient.phone}
        </p>
        <p>
          <strong>Email:</strong> {patient.email}
        </p>
        <p>
          <strong>Provider:</strong> {patient.provider}
        </p>
      </div>

      <Link
        href="/patients"
        style={{
          padding: "0.5rem 1rem",
          background: "#0b2b4a",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        Back to Patients
      </Link>
    </div>
  );
}
