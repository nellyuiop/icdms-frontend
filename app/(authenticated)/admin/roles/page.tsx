"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";

type User = {
  id: string;
  role: string;
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

        // API returns string[] like ["ADMIN", "CLINICIAN", "STAFF"]
        const rolesData = rolesRes.data || [];
        setRoles(rolesData);

        const counts: Record<string, number> = {};
        (usersRes.data || []).forEach((u) => {
          counts[u.role] = (counts[u.role] || 0) + 1;
        });
        setUserCounts(counts);
      } catch (err) {
        console.error("Error fetching roles:", err);
        // Fallback to known roles
        setRoles(["ADMIN", "CLINICIAN", "STAFF"]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const roleBadgeColor: Record<string, string> = {
    ADMIN: "#dc2626",
    CLINICIAN: "#2563eb",
    STAFF: "#10b981",
  };

  if (loading) return <p style={{ color: "#777" }}>Loading...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem" }}>Roles Overview</h2>

      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
        Roles are managed by the system. Below is the list of available roles and
        user counts.
      </p>

      <div style={{ display: "grid", gap: "1rem", maxWidth: "600px" }}>
        {roles.map((role) => (
          <div
            key={role}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "white",
                  background: roleBadgeColor[role] || "#6b7280",
                }}
              >
                {role}
              </span>
            </div>
            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              {userCounts[role] || 0} user{(userCounts[role] || 0) !== 1 ? "s" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
