"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPatient() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    insurance: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("New Patient:", form);

    // Later → send to backend
    // fetch("/api/patients", { method: "POST", body: JSON.stringify(form) })

    router.push("/staff/patients");
  };

  return (
    <div style={{ padding: "2rem 0" }}>
      <h1>Add New Patient</h1>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          marginTop: "1.5rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          maxWidth: "600px",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="insurance"
            placeholder="Insurance"
            value={form.insurance}
            onChange={handleChange}
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              backgroundColor: "#E53935",
              color: "white",
              padding: "0.7rem",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              marginTop: "1rem",
            }}
          >
            Save Patient
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};