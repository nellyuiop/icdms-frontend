import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "2rem 0" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #0b2b4a, #1a4b76)",
          color: "white",
          padding: "3rem",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          Welcome to ICDMS
        </h1>
        <p style={{ fontSize: "1.2rem" }}>
          Integrated Clinical Data Management System
        </p>
      </div>

      <Link
        href="/patients"
        style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          background: "#0b2b4a",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        View Patients
      </Link>
    </div>
  );
}
