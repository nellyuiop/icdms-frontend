"use client";

import Link from "next/link";

// Simple mock data
const mockPatients = [
  {
    id: "P-1001",
    name: "John Smith",
    phone: "(555) 123-4567",
    provider: "Dr. Williams",
  },
  {
    id: "P-1002",
    name: "Maria Garcia",
    phone: "(555) 234-5678",
    provider: "Dr. Chen",
  },
];

export default function PatientsPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Patients</h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>ID</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Name</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Phone</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Provider</th>
          </tr>
        </thead>
        <tbody>
          {mockPatients.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: "0.5rem" }}>{p.id}</td>
              <td style={{ padding: "0.5rem" }}>{p.name}</td>
              <td style={{ padding: "0.5rem" }}>{p.phone}</td>
              <td style={{ padding: "0.5rem" }}>{p.provider}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
