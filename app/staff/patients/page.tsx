"use client";

import { useState } from "react";
import Link from "next/link";

export default function StaffPatients() {
  const [search, setSearch] = useState("");
 const patients = [
  {
    id: 1,
    firstName: "Sara",
    lastName: "Haddad",
    phone: "71 123 456",
    dob: "1998-05-10",
    gender: "Female",
  },
  {
    id: 2,
    firstName: "Ali",
    lastName: "Mansour",
    phone: "70 987 321",
    dob: "1995-02-14",
    gender: "Male",
  },
];
const filteredPatients = patients.filter((patient) =>
  `${patient.firstName} ${patient.lastName} ${patient.phone}`
    .toLowerCase()
    .includes(search.toLowerCase())
);

  return (
    <div style={{ padding: "2rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Patients</h1>

        <Link
          href="/staff/patients/new"
          style={{
            backgroundColor: "#E53935",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          + Add Patient
        </Link>
      </div>
<div style={{ margin: "1.5rem 0" }}>
  <input
    type="text"
    placeholder="Search patients..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      padding: "0.6rem 1rem",
      borderRadius: "6px",
      border: "1px solid #ccc",
      width: "300px",
    }}
  />
</div>
      <div
        style={{
          marginTop: "2rem",
          background: "white",
          borderRadius: "8px",
          padding: "1rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th align="left">firstName</th>
              <th align="left">lastName</th>
              <th align="left">Phone</th>
              <th align="left">DOB</th>
              <th align="left">Gender</th>
              <th align="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{patient.firstName}</td>
                <td>{patient.lastName}</td>
                <td>{patient.phone}</td>
                <td>{patient.dob}</td>
                <td>{patient.gender}</td>
                <td>
                  <Link
                    href={`/staff/patients/${patient.id}`}
                    style={{ color: "#0F2A4F" }}
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
