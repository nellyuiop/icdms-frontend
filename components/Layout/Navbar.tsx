"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Patients", path: "/patients" },
    { name: "Visits", path: "/visits" },
    { name: "Labs", path: "/labs" },
    { name: "Documents", path: "/documents" },
  ];

  return (
    <nav
      style={{
        background: "linear-gradient(90deg, #0b2b4a 0%, #1a4b76 100%)",
        padding: "0.75rem 2rem",
        boxShadow: "0 4px 12px rgba(0,20,40,0.2)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo and Brand */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              background: "white",
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1.5rem",
              color: "#0b2b4a",
              boxShadow: "0 2px 8px rgba(255,255,255,0.2)",
            }}
          >
            I
          </div>
          <div>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "white",
                letterSpacing: "1px",
              }}
            >
              ICDMS
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                color: "#a0c8e8",
                display: "block",
                marginTop: "-4px",
              }}
            >
              Clinical Data Management
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              style={{
                color: pathname === item.path ? "white" : "#a0c8e8",
                textDecoration: "none",
                fontWeight: pathname === item.path ? "600" : "400",
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
                background:
                  pathname === item.path
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                transition: "all 0.2s",
                fontSize: "0.95rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "white";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  pathname === item.path ? "white" : "#a0c8e8";
                e.currentTarget.style.background =
                  pathname === item.path
                    ? "rgba(255,255,255,0.1)"
                    : "transparent";
              }}
            >
              {item.name}
            </Link>
          ))}

          {/* User Profile Placeholder */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#a0c8e8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0b2b4a",
              fontWeight: "bold",
              marginLeft: "1rem",
              cursor: "pointer",
            }}
          >
            DR
          </div>
        </div>

        {/* Mobile Menu Button (hidden on desktop) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu (hidden by default) */}
      {mobileMenuOpen && (
        <div
          style={{
            display: "none",
            padding: "1rem",
            background: "#1a4b76",
            marginTop: "0.5rem",
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: "block",
                color: "white",
                textDecoration: "none",
                padding: "0.75rem",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
