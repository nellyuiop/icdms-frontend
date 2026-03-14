"use client";

import { useEffect, useState } from "react";
import { getPatients } from "@/api/patientServices";
import Link from "next/link";

export default function PatientsList() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPatients(search);
      setPatients(data);
    };
    fetchData();
  }, [search]);

  return (
    <div style={{ padding: 32 }}>
      <h1>Patients</h1>
      <input
        placeholder="Search patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.firstName} {p.lastName}</td>
              <td>{p.dob}</td>
              <td>{p.gender}</td>
              <td>{p.phone}</td>
              <td>
                <Link href={`/staff/patients/${p.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}