"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";

export default function NewPatientPage() {
  const { isAdmin, isStaff } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isAdmin && !isStaff) {
    router.replace("/dashboard");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.post("/patients", form);
      router.push("/patients");
    } catch (err) {
      console.error("Error creating patient:", err);
      setError("Failed to create patient. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem" }}>Add New Patient</h2>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          maxWidth: "600px",
        }}
      >
        {error && (
          <div
            style={{
              padding: "10px",
              background: "#fef2f2",
              color: "#dc2626",
              borderRadius: "6px",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
              Full Name
            </label>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

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
              marginTop: "0.5rem",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Creating..." : "Create Patient"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};
