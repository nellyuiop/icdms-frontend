import Link from "next/link";
import { Users, Calendar, Microscope, FileText } from "lucide-react";

export default function Home() {
  // Stats for dashboard
  const stats = [
    { label: "Total Patients", value: "1,247", icon: Users, change: "+12%" },
    { label: "Today's Visits", value: "28", icon: Calendar, change: "+4" },
    { label: "Pending Labs", value: "16", icon: Microscope, change: "-3" },
    { label: "Clinical Documents", value: "342", icon: FileText, change: "+23" },
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
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              <stat.icon size={32} color="#0b2b4a"/>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div
              style={{
                fontSize: "0.8rem",
                color: stat.change.startsWith("+") ? "#10b981" : "#ef4444",
                marginTop: "0.5rem",
              }}
            >
              {stat.change} from last month
            </div>
          </div>
        ))}
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
      >
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>
            New Visit
          </h3>
          <p style={{ color: "var(--gray)", marginBottom: "1rem" }}>
            Schedule a new patient visit
          </p>
          <Link href="/patients" className="btn btn-secondary">
            Get Started
          </Link>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>
            Lab Results
          </h3>
          <p style={{ color: "var(--gray)", marginBottom: "1rem" }}>
            View pending lab reports
          </p>
          <Link href="/patients" className="btn btn-secondary">
            View Labs
          </Link>
        </div>
      </div>
    </div>
  );
}
