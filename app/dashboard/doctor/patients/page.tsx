"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";

type PatientRecord = {
  id: string;
  external_id?: string;
  name?: string;
  dob: string;
  gender?: string | null;
};

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get<PatientRecord[]>("/patients");
        setPatients(res.data || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    fetchPatients();
  }, []);

  const filtered = patients.filter((patient) => {
    const name = patient.name || "";
    const externalId = patient.external_id || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      externalId.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div
      style={{
        padding: "30px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Patients</h2>

      <input
        placeholder="Search by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "350px",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead style={{ background: "#f4f6f8" }}>
          <tr>
            <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
            <th style={{ padding: "12px", textAlign: "left" }}>DOB</th>
            <th style={{ padding: "12px", textAlign: "left" }}>Gender</th>
            <th style={{ padding: "12px" }}></th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#777",
                }}
              >
                No patients found
              </td>
            </tr>
          ) : (
            filtered.map((patient) => (
              <tr
                key={patient.id}
                style={{
                  borderTop: "1px solid #eee",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                }}
              >
                <td style={{ padding: "12px" }}>{patient.external_id}</td>
                <td style={{ padding: "12px" }}>{patient.name}</td>
                <td style={{ padding: "12px" }}>
                  {new Date(patient.dob).toLocaleDateString()}
                </td>
                <td style={{ padding: "12px" }}>{patient.gender}</td>

                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => {
                      router.push(`/dashboard/doctor/patients/${patient.id}`);
                    }}
                    style={{
                      padding: "6px 12px",
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
