"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { users } from "../lib/users";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("Invalid email or password");
      return;
    }

    if (user.role === "admin") {
      router.push("/admin");
    }

    if (user.role === "doctor") {
      router.push("/dashboard/doctor");
    }

    if (user.role === "staff") {
      router.push("/staff");
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
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center", color: "#0b2b4a" }}>
          Sign In
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button style={buttonStyle}>Login</button>
        </form>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
          }}
        >
          <Link href="/forgot-password">Forgot password</Link>
          <Link href="/signup">Create account</Link>
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