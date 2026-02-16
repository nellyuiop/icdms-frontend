"use client";

import { useState } from "react";
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
  },
];

export default function PatientsPage() {
  const [search, setSearch] = useState("");

  const filteredPatients = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Patients</h1>

      <input
        type="text"
        placeholder="Search patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "0.75rem",
          marginBottom: "2rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <div
        style={{ background: "white", borderRadius: "8px", overflow: "hidden" }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={{ padding: "1rem", textAlign: "left" }}>ID</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Phone</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Provider</th>
              <th style={{ padding: "1rem", textAlign: "left" }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "1rem" }}>{p.id}</td>
                <td style={{ padding: "1rem" }}>{p.name}</td>
                <td style={{ padding: "1rem" }}>{p.phone}</td>
                <td style={{ padding: "1rem" }}>{p.provider}</td>
                <td style={{ padding: "1rem" }}>
                  <Link
                    href={`/patients/${p.id}`}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#2563eb",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "4px",
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
  );
}
