"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import PageBackLink from "@/components/PageBackLink";
import { Plus, Trash2, Pencil, X, Check, KeyRound, Copy } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import RoleSelect from "@/components/RoleSelect";

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
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STAFF" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  const [actionError, setActionError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [resetting, setResetting] = useState(false);
  const [resetResult, setResetResult] = useState<{ userName: string; tempPassword: string } | null>(null);
  const [copied, setCopied] = useState(false);

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
    setFormError("");
    try {
      await api.post("/api/users", form);
      setShowForm(false);
      setForm({ name: "", email: "", password: "", role: "STAFF" });
      fetchUsers();
    } catch {
      setFormError("Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (user: User) => {
    setEditingUser(user.id);
    setEditForm({ name: user.name || "", email: user.email, role: user.role });
    setActionError("");
  };

  const handleUpdate = async (userId: string) => {
    setActionError("");
    try {
      await api.patch(`/api/users/${userId}`, editForm);
      setEditingUser(null);
      fetchUsers();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update user.";
      setActionError(msg);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError("");
    try {
      await api.delete(`/api/users/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to delete user.";
      setActionError(msg);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetTarget) return;
    setResetting(true);
    setActionError("");
    try {
      const res = await api.post<{ temporaryPassword: string }>(`/api/users/${resetTarget.id}/reset-password`);
      setResetResult({
        userName: resetTarget.name || resetTarget.email,
        tempPassword: res.data.temporaryPassword,
      });
      setResetTarget(null);
    } catch {
      setActionError("Failed to reset password.");
      setResetTarget(null);
    } finally {
      setResetting(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSelf = (userId: string) => currentUser.id === userId;

  const isOnlyAdmin = (user: User) => {
    if (user.role !== "ADMIN") return false;
    return users.filter((u) => u.role === "ADMIN").length <= 1;
  };

  return (
    <div>
      <PageBackLink />

      <div className="page-header">
        <h2 className="page-title">User Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn ${showForm ? "btn-ghost" : "btn-primary"}`}
        >
          {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add User</>}
        </button>
      </div>

      {actionError && (
        <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
          {actionError}
        </div>
      )}

      {showForm && (
        <div className="form-panel" style={{ maxWidth: "500px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary)", marginBottom: "1rem" }}>
            Create New User
          </h3>
          {formError && <div className="alert alert-error">{formError}</div>}
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
              <label className="form-label">Temporary Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Temporary password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <RoleSelect
                value={form.role}
                onChange={(role) => setForm({ ...form, role })}
              />
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
                  <td>
                    {editingUser === user.id ? (
                      <input
                        className="form-input"
                        style={{ padding: "4px 8px", fontSize: "0.85rem" }}
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    ) : (
                      <span style={{ fontWeight: 500 }}>{user.name || "---"}</span>
                    )}
                  </td>
                  <td>
                    {editingUser === user.id ? (
                      <input
                        className="form-input"
                        type="email"
                        style={{ padding: "4px 8px", fontSize: "0.85rem" }}
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {editingUser === user.id ? (
                      <RoleSelect
                        value={editForm.role}
                        onChange={(role) => setEditForm({ ...editForm, role })}
                      />
                    ) : (
                      <span className={`${roleBadgeClass[user.role] || "badge"}`} style={{ color: "white" }}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", whiteSpace: "nowrap" }}>
                      {editingUser === user.id ? (
                        <>
                          <button onClick={() => handleUpdate(user.id)} className="btn btn-sm btn-primary" title="Save">
                            <Check size={13} />
                          </button>
                          <button onClick={() => setEditingUser(null)} className="btn btn-sm btn-ghost" title="Cancel">
                            <X size={13} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(user)}
                            className="btn btn-sm btn-ghost"
                            title="Edit user"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setResetTarget(user)}
                            className="btn btn-sm btn-secondary"
                            title="Reset password"
                          >
                            <KeyRound size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(user)}
                            className="btn btn-sm btn-danger"
                            title={
                              isSelf(user.id)
                                ? "Cannot delete your own account"
                                : isOnlyAdmin(user)
                                  ? "Cannot delete the only admin"
                                  : "Delete user"
                            }
                            disabled={isSelf(user.id) || isOnlyAdmin(user)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.name || deleteTarget?.email || "this user"}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        open={!!resetTarget}
        title="Reset Password"
        message={`Generate a new temporary password for ${resetTarget?.name || resetTarget?.email || "this user"}? They will be required to change it on next login.`}
        confirmLabel="Reset Password"
        confirmVariant="primary"
        loading={resetting}
        onConfirm={handleResetPassword}
        onCancel={() => setResetTarget(null)}
      />

      {resetResult && (
        <div className="modal-overlay" onClick={() => { setResetResult(null); setCopied(false); }}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Password Reset</h3>
            <p className="modal-body">
              Temporary password for <strong>{resetResult.userName}</strong>:
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--gray-100)",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  flex: 1,
                  fontFamily: "monospace",
                  fontSize: "1.1rem",
                  letterSpacing: "0.05em",
                  textAlign: "center",
                  userSelect: "all",
                }}
              >
                {resetResult.tempPassword}
              </span>
              <button
                onClick={() => handleCopy(resetResult.tempPassword)}
                className="btn btn-sm btn-ghost"
                title="Copy to clipboard"
                style={{ flexShrink: 0 }}
              >
                <Copy size={15} />
                {copied && (
                  <span style={{ fontSize: "0.75rem", color: "var(--secondary)" }}>Copied</span>
                )}
              </button>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginBottom: "1rem" }}>
              Share this password with the user. They will be required to change it on next login.
            </p>
            <div className="modal-actions">
              <button onClick={() => { setResetResult(null); setCopied(false); }} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
