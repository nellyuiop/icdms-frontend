"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  function handleReset(e: React.FormEvent) {
    e.preventDefault();
    alert("Password reset link sent (demo)");
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
        <p>Reset your password</p>
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
        <h2 style={{ marginBottom: "1.5rem", color: "#0b2b4a", textAlign: "center" }}>
          Forgot Password
        </h2>

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <button style={buttonStyle}>Send Reset Link</button>
        </form>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link href="/login" style={linkStyle}>
            Back to Login
          </Link>
        </div>
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

const linkStyle = {
  color: "#0b2b4a",
  textDecoration: "none",
};