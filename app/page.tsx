import Link from "next/link";

export default function Home() {
  // Mock stats for dashboard
  const stats = [
    { label: "Total Patients", value: "1,247", change: "+12%", icon: "👥" },
    { label: "Today's Visits", value: "28", change: "+4", icon: "📅" },
    { label: "Pending Labs", value: "16", change: "-3", icon: "🔬" },
    { label: "Documents", value: "342", change: "+23", icon: "📄" },
  ];

  const recentPatients = [
    {
      id: "P-1001",
      name: "John Smith",
      lastVisit: "2026-02-10",
      provider: "Dr. Williams",
    },
    {
      id: "P-1002",
      name: "Maria Garcia",
      lastVisit: "2026-02-12",
      provider: "Dr. Chen",
    },
    {
      id: "P-1003",
      name: "Robert Johnson",
      lastVisit: "2026-02-05",
      provider: "Dr. Williams",
    },
  ];

  return (
    <div style={{ padding: "2rem 0" }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0b2b4a 0%, #1a4b76 100%)",
          color: "white",
          padding: "2.5rem",
          borderRadius: "16px",
          marginBottom: "2rem",
          boxShadow: "0 8px 20px rgba(0,40,80,0.2)",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
            fontWeight: "600",
          }}
        >
          Welcome to ICDMS
        </h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.9, marginBottom: "1.5rem" }}>
          Integrated Clinical Data Management System
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            href="/patients"
            style={{
              padding: "0.75rem 1.5rem",
              background: "white",
              color: "#0b2b4a",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            View Patients
          </Link>
          <Link
            href="/visits/new"
            style={{
              padding: "0.75rem 1.5rem",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "500",
            }}
          >
            New Visit
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontSize: "2rem" }}>{stat.icon}</span>
              <span
                style={{
                  color: stat.change.startsWith("+") ? "#10b981" : "#ef4444",
                  background: stat.change.startsWith("+")
                    ? "#d1fae5"
                    : "#fee2e2",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                }}
              >
                {stat.change}
              </span>
            </div>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "#0b2b4a",
              }}
            >
              {stat.value}
            </div>
            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Patients */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{ fontSize: "1.3rem", color: "#0b2b4a", fontWeight: "600" }}
          >
            Recent Patients
          </h2>
          <Link
            href="/patients"
            style={{
              color: "#1a4b76",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            View All →
          </Link>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                ID
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                Name
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                Last Visit
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                Provider
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              ></th>
            </tr>
          </thead>
          <tbody>
            {recentPatients.map((patient) => (
              <tr
                key={patient.id}
                style={{ borderBottom: "1px solid #f3f4f6" }}
              >
                <td style={{ padding: "0.75rem", fontWeight: "500" }}>
                  {patient.id}
                </td>
                <td style={{ padding: "0.75rem" }}>{patient.name}</td>
                <td style={{ padding: "0.75rem", color: "#6b7280" }}>
                  {patient.lastVisit}
                </td>
                <td style={{ padding: "0.75rem", color: "#6b7280" }}>
                  {patient.provider}
                </td>
                <td style={{ padding: "0.75rem" }}>
                  <Link
                    href={`/patients/${patient.id}`}
                    style={{
                      padding: "0.4rem 0.8rem",
                      background: "#f3f4f6",
                      color: "#0b2b4a",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontSize: "0.9rem",
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
