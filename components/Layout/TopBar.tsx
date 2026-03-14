"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { logoutSession } from "@/app/lib/auth";
import { LogOut } from "lucide-react";

const roleBadgeClass: Record<string, string> = {
  ADMIN: "badge-admin",
  CLINICIAN: "badge-clinician",
  STAFF: "badge-staff",
};

export default function TopBar() {
  const { user, role } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutSession();
    router.push("/login");
  };

  return (
    <header className="topbar">
      <span className="topbar-user">{user?.name || user?.email}</span>

      {role && (
        <span className={`topbar-badge ${roleBadgeClass[role] || ""}`}>
          {role}
        </span>
      )}

      <button onClick={handleLogout} className="topbar-logout">
        <LogOut size={14} />
        Logout
      </button>
    </header>
  );
}
