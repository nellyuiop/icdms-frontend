"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("https://api.cliniq.cloud/patients", {
        headers: {
          "x-api-key": "icdms_2026_ntccgfjck",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPatients(res.data || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const filtered = patients.filter((p: any) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.external_id || "").toLowerCase().includes(search.toLowerCase())
  );

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
            filtered.map((p: any) => (
              <tr
                key={p.id}
                style={{
                  borderTop: "1px solid #eee",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                <td style={{ padding: "12px" }}>{p.external_id}</td>
                <td style={{ padding: "12px" }}>{p.name}</td>
                <td style={{ padding: "12px" }}>
                  {new Date(p.dob).toLocaleDateString()}
                </td>
                <td style={{ padding: "12px" }}>{p.gender}</td>

                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/doctor/patients/${p.id}`)
                    }
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