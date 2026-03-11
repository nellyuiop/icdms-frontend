"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        background: "#0b2b4a",
        padding: "1rem 2rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "white",
            textDecoration: "none",
          }}
        >
          ClinIQ
        </Link>

        <div style={{ display: "flex", gap: "2rem" }}>
          <Link
            href="/"
            style={{
              color: pathname === "/" ? "white" : "#a0c8e8",
              textDecoration: "none",
            }}
          >
            Dashboard
          </Link>
          <Link
            href="/patients"
            style={{
              color: pathname?.startsWith("/patients") ? "white" : "#a0c8e8",
              textDecoration: "none",
            }}
          >
            Patients
          </Link>
          <Link
            href="/visits"
            style={{
              color: pathname?.startsWith("/visits") ? "white" : "#a0c8e8",
              textDecoration: "none",
            }}
          >
            Visits
          </Link>
          <Link
            href="/staff"
            style={{
              color: pathname?.startsWith("/staff") ? "white" : "#a0c8e8",
              textDecoration: "none",
            }}
          >
            Staff
          </Link>
          <Link
            href="/admin"
            style={{
              color: pathname?.startsWith("/admin") ? "white" : "#a0c8e8",
              textDecoration: "none",
            }}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
