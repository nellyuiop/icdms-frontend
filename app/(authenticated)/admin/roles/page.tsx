"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { Shield, Stethoscope, UserCheck, ShieldCheck } from "lucide-react";

type User = {
  id: string;
  role: string;
};

const roleConfig: Record<string, { icon: typeof Shield; bg: string; color: string }> = {
  ADMIN: { icon: ShieldCheck, bg: "#fef2f2", color: "#dc2626" },
  CLINICIAN: { icon: Stethoscope, bg: "#dbeafe", color: "#2563eb" },
  STAFF: { icon: UserCheck, bg: "#d1fae5", color: "#10b981" },
};

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<string[]>([]);
  const [userCounts, setUserCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, usersRes] = await Promise.all([
          api.get<string[]>("/api/roles"),
          api.get<User[]>("/api/users"),
        ]);

        const rolesData = rolesRes.data || [];
        setRoles(rolesData);

        const counts: Record<string, number> = {};
        (usersRes.data || []).forEach((u) => {
          counts[u.role] = (counts[u.role] || 0) + 1;
        });
        setUserCounts(counts);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setRoles(["ADMIN", "CLINICIAN", "STAFF"]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Roles Overview</h2>
      </div>

      <p style={{ color: "var(--gray-500)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
        Roles are managed by the system. Below is the list of available roles and
        user counts.
      </p>

      <div className="stats-grid" style={{ maxWidth: "700px" }}>
        {roles.map((role) => {
          const config = roleConfig[role] || { icon: Shield, bg: "var(--gray-100)", color: "var(--gray-500)" };
          const Icon = config.icon;
          return (
            <div key={role} className="stat-card">
              <div className="stat-icon" style={{ background: config.bg }}>
                <Icon size={20} color={config.color} />
              </div>
              <div>
                <div className="stat-value" style={{ fontSize: "1.5rem" }}>
                  {userCounts[role] || 0}
                </div>
                <div className="stat-label">
                  {role.charAt(0) + role.slice(1).toLowerCase()}s
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
