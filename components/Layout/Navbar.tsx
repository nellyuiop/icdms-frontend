"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const authPages = ["/login", "/signup", "/forgot-password"];

  const hideNavbar = authPages.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );

  if (hideNavbar) {
    return null;
  }

  const isAdmin =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/patients") ||
    pathname.startsWith("/visits");

  const isDoctor =
    pathname.startsWith("/doctor") ||
    pathname.startsWith("/dashboard/doctor") ||
    pathname.startsWith("/appointments");

  const isStaff = pathname.startsWith("/staff");

  let panelLabel = "";
  let links: { href: string; label: string }[] = [];

  if (isAdmin) {
    panelLabel = "ADMIN PANEL";
    links = [
      { href: "/admin", label: "Dashboard" },
      { href: "/patients", label: "Patients" },
      { href: "/visits", label: "Visits" },
    ];
  } else if (isDoctor) {
    panelLabel = "DOCTOR PANEL";
    links = [
      { href: "/dashboard/doctor", label: "Dashboard" },
      { href: "/appointments", label: "Visits" },
    ];
  } else if (isStaff) {
    panelLabel = "STAFF PANEL";
    links = [
      { href: "/staff", label: "Dashboard" },
      { href: "/staff/patients", label: "Patients" },
      { href: "/staff/appointments", label: "Visits" },
    ];
  }

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

        {panelLabel && (
          <span
            style={{
              fontSize: "12px",
              opacity: 0.8,
              marginTop: "2px",
              letterSpacing: "1px",
            }}
          >
            {panelLabel}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} style={linkStyle}>
            {link.label}
          </Link>
        ))}

        {panelLabel && (
          <button
            onClick={() => router.push("/login")}
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