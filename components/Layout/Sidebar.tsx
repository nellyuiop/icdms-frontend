"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Sidebar() {
  const { isAdmin, isStaff } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const links: { href: string; label: string; show: boolean }[] = [
    { href: "/dashboard", label: "Dashboard", show: true },
    { href: "/patients", label: "Patients", show: true },
    { href: "/appointments", label: "Appointments", show: true },
    { href: "/patients/new", label: "Add Patient", show: isStaff || isAdmin },
    { href: "/admin/users", label: "Users", show: isAdmin },
    { href: "/admin/roles", label: "Roles", show: isAdmin },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      style={{
        width: collapsed ? "60px" : "240px",
        background: "#0b2b4a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        flexShrink: 0,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          padding: collapsed ? "1rem 0.5rem" : "1.5rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        {!collapsed && (
          <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>ClinIQ</span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "1.2rem",
            padding: "4px",
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      <nav style={{ flex: 1, padding: "0.5rem 0" }}>
        {links
          .filter((l) => l.show)
          .map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: collapsed ? "12px 0" : "12px 1rem",
                  justifyContent: collapsed ? "center" : "flex-start",
                  color: "white",
                  textDecoration: "none",
                  background: active ? "rgba(255,255,255,0.15)" : "transparent",
                  borderLeft: active ? "3px solid #2563eb" : "3px solid transparent",
                  fontSize: "0.95rem",
                  transition: "background 0.15s",
                }}
                title={collapsed ? link.label : undefined}
              >
                {!collapsed && link.label}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}
