import Link from "next/link";

export default function PatientsPage() {
  const patients = [
    { id: "P-1001", name: "John Smith", doctor: "Dr. Williams" },
    { id: "P-1002", name: "Maria Garcia", doctor: "Dr. Chen" },
    { id: "P-1003", name: "Robert Johnson", doctor: "Dr. Williams" },
  ];

  return (
    <div style={{ padding: "2rem 0" }}>
      <div
        style={{
          background:
            "linear-gradient(135deg, #0b2b4a 0%, #1a4b76 50%, #2563eb 100%)",
          color: "white",
          padding: "2rem",
          borderRadius: "16px",
          marginBottom: "2rem",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "0.4rem", fontWeight: 700 }}>
          Patients
        </h1>
        <p style={{ opacity: 0.9 }}>Patient overview</p>
      </div>

      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={thStyle}>Patient ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Doctor</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={tdStyle}>{patient.id}</td>
                <td style={tdStyle}>{patient.name}</td>
                <td style={tdStyle}>{patient.doctor}</td>
                <td style={tdStyle}>
                  <Link
                    href={`/patients/${patient.id}/visits`}
                    style={{
                      padding: "0.35rem 0.8rem",
                      background: "#0b2b4a",
                      color: "white",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "0.8rem",
                    }}
                  >
                    View Visits
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

const thStyle = {
  padding: "0.75rem",
  textAlign: "left" as const,
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#6b7280",
};

const tdStyle = {
  padding: "0.75rem",
  fontSize: "0.9rem",
  color: "#374151",
};