"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";

type User = {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  createdAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Create user form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STAFF" });
  const [submitting, setSubmitting] = useState(false);

  // Edit role
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get<User[]>("/api/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/users", form);
      setShowForm(false);
      setForm({ name: "", email: "", password: "", role: "STAFF" });
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleUpdate = async (userId: string) => {
    try {
      await api.patch(`/api/users/${userId}/role`, { role: editRole });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/api/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const roleBadgeColor: Record<string, string> = {
    ADMIN: "#dc2626",
    CLINICIAN: "#2563eb",
    STAFF: "#10b981",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ margin: 0 }}>User Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "8px 16px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {showForm ? "Cancel" : "+ Add User"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginBottom: "1.5rem",
            maxWidth: "500px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Create New User</h3>
          <form onSubmit={handleCreate} style={{ display: "grid", gap: "1rem" }}>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              style={inputStyle}
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={inputStyle}
            >
              <option value="STAFF">Staff</option>
              <option value="CLINICIAN">Clinician</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "0.8rem",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: submitting ? "not-allowed" : "pointer",
                fontWeight: 600,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <p style={{ color: "#777" }}>Loading...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead style={{ background: "#f4f6f8" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Role</th>
              <th style={{ padding: "12px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{user.name || "—"}</td>
                <td style={{ padding: "12px" }}>{user.email}</td>
                <td style={{ padding: "12px" }}>
                  {editingUser === user.id ? (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        style={{ padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
                      >
                        <option value="STAFF">Staff</option>
                        <option value="CLINICIAN">Clinician</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <button
                        onClick={() => handleRoleUpdate(user.id)}
                        style={actionBtn("#2563eb")}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        style={actionBtn("#6b7280")}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span
                      style={{
                        padding: "2px 10px",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "white",
                        background: roleBadgeColor[user.role] || "#6b7280",
                      }}
                    >
                      {user.role}
                    </span>
                  )}
                </td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                    <button
                      onClick={() => {
                        setEditingUser(user.id);
                        setEditRole(user.role);
                      }}
                      style={actionBtn("#2563eb")}
                    >
                      Edit Role
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={actionBtn("#dc2626")}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const actionBtn = (bg: string) => ({
  padding: "4px 10px",
  background: bg,
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer" as const,
  fontSize: "0.8rem",
  fontWeight: 500 as const,
});
