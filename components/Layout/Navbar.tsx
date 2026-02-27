"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const role =
    pathname.startsWith("/admin")
      ? "admin"
      : pathname.startsWith("/doctor")
      ? "doctor"
      : pathname.startsWith("/staff")
      ? "staff"
      : null;

  return (
    <nav
      style={{
        backgroundColor: "#0F2A4F",
        color: "white",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
  <h2 style={{ margin: 0 }}>ClinIQ</h2>

  {role && (
    <span
      style={{
        fontSize: "12px",
        opacity: 0.8,
        marginTop: "2px",
        letterSpacing: "1px",
      }}
    >
      {role.toUpperCase()} PANEL
    </span>
  )}
</div>

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {role === "staff" && (
          <>
            <Link href="/staff" style={linkStyle}>
  Dashboard
</Link>
       <Link href="/staff/patients" style={linkStyle}>
  Patients
</Link>
            
                   <Link href="/staff/appointments" style={linkStyle}>
  Appointments
</Link>
          </>
        )}

       {role === "doctor" && (
  <>
    <Link href="/doctor" style={linkStyle}>
      Dashboard
    </Link>

    <Link href="/doctor/patients" style={linkStyle}>
      Patients
    </Link>

    <Link href="/doctor/appointments" style={linkStyle}>
      Appointments
    </Link>
  </>
)}

       {role === "admin" && (
  <>
    <Link href="/admin" style={linkStyle}>
      Dashboard
    </Link>

    <Link href="/admin/users" style={linkStyle}>
      Users
    </Link>

    <Link href="/admin/roles" style={linkStyle}>
      Roles
    </Link>
  </>
)}

        {role && (
          <button
            style={{
              backgroundColor: "#E53935",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
  
}
const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "16px",
};