"use client";

import { useState } from "react";
import { createPatient } from "@/api/patientServices";
import { useRouter } from "next/navigation";

// Define the proper type
interface PatientForm {
  firstName: string;
  lastName: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone: string;
  email?: string;
  address?: string;
  insurance?: string;
}

export default function NewPatientPage() {
  const router = useRouter();

  const [form, setForm] = useState<PatientForm>({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "MALE",
    phone: "",
    email: "",
    address: "",
    insurance: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPatient(form);
    router.push("/staff/patients");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create Patient</h1>

      <form onSubmit={submit} style={{ display: "grid", gap: "1rem", maxWidth: "400px" }}>
        <input
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />
        <input
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
          required
        />
        <select
          value={form.gender}
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value as "MALE" | "FEMALE" | "OTHER" })
          }
          required
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          placeholder="Insurance"
          value={form.insurance}
          onChange={(e) => setForm({ ...form, insurance: e.target.value })}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}