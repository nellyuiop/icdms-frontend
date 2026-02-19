import Link from "next/link";
import { Users, Calendar, Microscope } from "lucide-react";

export default function Home() {
  // Stats for dashboard
  const stats = [
    { label: "Total Patients", value: "1,247", icon: Users, change: "+12%" },
    { label: "Today's Visits", value: "28", icon: Calendar, change: "+4" },
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
    <div className="container" style={{ padding: "2rem 0" }}>
      {/* Welcome Banner */}
      <div className="profile-header">
        <h1>Welcome to ClinIQ</h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.9 }}>
          Intelligent Clinical Data Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Total Patients Card */}
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0b2b4a"
            strokeWidth="1.5"
            style={{ marginBottom: "1rem" }}
          >
            <path d="M12 4.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          </svg>
          <div
            style={{ fontSize: "2rem", fontWeight: "600", color: "#0b2b4a" }}
          >
            1,247
          </div>
          <div
            style={{
              color: "#6b7280",
              fontSize: "0.85rem",
              letterSpacing: "0.5px",
              marginBottom: "0.5rem",
            }}
          >
            TOTAL PATIENTS
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#059669",
              background: "#ecfdf5",
              padding: "0.25rem 0.75rem",
              borderRadius: "20px",
              display: "inline-block",
            }}
          ></div>
        </div>

        {/* Today's Visits Card */}
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0b2b4a"
            strokeWidth="1.5"
            style={{ marginBottom: "1rem" }}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <div
            style={{ fontSize: "2rem", fontWeight: "600", color: "#0b2b4a" }}
          >
            28
          </div>
          <div
            style={{
              color: "#6b7280",
              fontSize: "0.85rem",
              letterSpacing: "0.5px",
              marginBottom: "1rem",
            }}
          >
            TODAY'S VISITS
          </div>

          {/* Status row - clean, no +4 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #e5e7eb",
              paddingTop: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#059669",
                }}
              >
                24
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Completed
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#d97706",
                }}
              >
                4
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Scheduled
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", color: "var(--primary)" }}>
            Recent Patients
          </h2>
          <Link
            href="/patients"
            style={{
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            View All →
          </Link>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Last Visit</th>
                <th>Provider</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <strong>{patient.id}</strong>
                  </td>
                  <td>{patient.name}</td>
                  <td>{patient.lastVisit}</td>
                  <td>{patient.provider}</td>
                  <td>
                    <Link
                      href={`/patients/${patient.id}`}
                      className="btn btn-primary"
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
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

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      ></div>
    </div>
  );
}
