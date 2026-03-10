"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { patientService, Patient } from "@/services/patients";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError("Failed to load patients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.id?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading patients...
      </div>
    );
  if (error)
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        {error}
      </div>
    );

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "2rem" }}>Patients</h1>
        <Link
          href="/patients/new"
          style={{
            padding: "0.6rem 1.2rem",
            background: "#2563eb",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "500",
          }}
        >
          + Add Patient
        </Link>
      </div>

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
                <td style={{ padding: "1rem" }}>{p.phone || "—"}</td>
                <td style={{ padding: "1rem" }}>{p.provider || "—"}</td>
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
