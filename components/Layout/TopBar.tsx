"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { logoutSession } from "@/app/lib/auth";

export default function TopBar() {
  const { user, role } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutSession();
    router.push("/login");
  };

  const roleBadgeColor: Record<string, string> = {
    ADMIN: "#dc2626",
    CLINICIAN: "#2563eb",
    STAFF: "#10b981",
  };

  return (
    <header
      style={{
        height: "56px",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 1.5rem",
        gap: "1rem",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: "0.9rem", color: "#374151" }}>
        {user?.name || user?.email}
      </span>

      {role && (
        <span
          style={{
            padding: "2px 10px",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "white",
            background: roleBadgeColor[role] || "#6b7280",
          }}
        >
          {role}
        </span>
      )}

      <button
        onClick={handleLogout}
        style={{
          padding: "6px 14px",
          background: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "0.85rem",
          fontWeight: 500,
        }}
      >
        Logout
      </button>
    </header>
  );
}
