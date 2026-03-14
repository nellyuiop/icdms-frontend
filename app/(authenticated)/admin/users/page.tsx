"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";

type User = {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  createdAt?: string;
};

const roleBadgeClass: Record<string, string> = {
  ADMIN: "badge badge-admin",
  CLINICIAN: "badge badge-clinician",
  STAFF: "badge badge-staff",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STAFF" });
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">User Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn ${showForm ? "btn-ghost" : "btn-primary"}`}
        >
          {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add User</>}
        </button>
      </div>

      {showForm && (
        <div className="form-panel" style={{ maxWidth: "500px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary)", marginBottom: "1rem" }}>
            Create New User
          </h3>
          <form onSubmit={handleCreate} className="form-grid">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="STAFF">Staff</option>
                <option value="CLINICIAN">Clinician</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg">
              {submitting ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: "1%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 500 }}>{user.name || "---"}</td>
                  <td>{user.email}</td>
                  <td>
                    {editingUser === user.id ? (
                      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                        <select
                          className="form-input"
                          style={{ width: "auto", padding: "4px 8px", fontSize: "0.8rem" }}
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                        >
                          <option value="STAFF">Staff</option>
                          <option value="CLINICIAN">Clinician</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                        <button onClick={() => handleRoleUpdate(user.id)} className="btn btn-sm btn-primary">
                          <Check size={13} />
                        </button>
                        <button onClick={() => setEditingUser(null)} className="btn btn-sm btn-ghost">
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <span className={`${roleBadgeClass[user.role] || "badge"}`} style={{ color: "white" }}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => {
                          setEditingUser(user.id);
                          setEditRole(user.role);
                        }}
                        className="btn btn-sm btn-ghost"
                        title="Edit role"
                      >
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-danger" title="Delete user">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
