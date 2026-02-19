"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPatientPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPatient = {
      id: `P-${Date.now()}`,
      name,
      dob,
      phone,
      email,
      address,
    };

    console.log("New Patient:", newPatient);

   

    router.push("/patients"); 
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        Add New Patient
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Save Patient
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.8rem",
  marginBottom: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.8rem 1.5rem",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
