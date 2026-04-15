"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import api from "@/app/lib/api";
import { getStoredUser, setAuthSession, getAccessToken } from "@/app/lib/auth";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const user = getStoredUser();
  const token = getAccessToken();

  if (!user || !token) {
    router.push("/login");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      const updatedUser = res.data.user;
      const token = getAccessToken();
      if (token && updatedUser) {
        setAuthSession({ accessToken: token, user: updatedUser });
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Failed to change password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: "2rem 0" }}>
      <div
        style={{
          background:
            "linear-gradient(135deg, #0b2b4a 0%, #1a4b76 50%, #2563eb 100%)",
          color: "white",
          padding: "2rem",
          borderRadius: "16px",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>ClinIQ</h1>
        <p>Clinical Data Management System</p>
      </div>

      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto",
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            marginBottom: "0.5rem",
            textAlign: "center",
            color: "#0b2b4a",
          }}
        >
          Change Password
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          {user?.must_change_password
            ? "You must change your temporary password before continuing."
            : "Update your password."}
        </p>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#dc2626",
              padding: "0.75rem",
              borderRadius: "8px",
              fontSize: "0.875rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-password-field" style={{ marginBottom: "1rem" }}>
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="form-input auth-input-password"
              style={inputStyle}
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowCurrentPassword((current) => !current)}
              aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
              aria-pressed={showCurrentPassword}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="auth-password-field" style={{ marginBottom: "1rem" }}>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input auth-input-password"
              style={inputStyle}
              required
              minLength={8}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowNewPassword((current) => !current)}
              aria-label={showNewPassword ? "Hide new password" : "Show new password"}
              aria-pressed={showNewPassword}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="auth-password-field" style={{ marginBottom: "1rem" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input auth-input-password"
              style={inputStyle}
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              aria-pressed={showConfirmPassword}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button style={buttonStyle} disabled={submitting}>
            {submitting ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.8rem",
  marginBottom: "1rem",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
};

const buttonStyle = {
  width: "100%",
  padding: "0.8rem",
  background: "#0b2b4a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
};
