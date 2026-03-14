"use client";

import { useEffect, useState } from "react";
import { createEncounter,CreateVisitRequest } from "@/api/encountersService";
import { getPatients } from "@/api/patientServices";
import { useRouter } from "next/navigation";

export default function NewAppointmentPage() {
  const router = useRouter();

  const [patients, setPatients] = useState<any[]>([]);

  const [form, setForm] = useState({
    patient_id: "",
    clinician_user_id: "",
    visit_date: "",
    reason: "",
  });

  useEffect(() => {
    const loadPatients = async () => {
      const data = await getPatients();
      setPatients(data);
    };

    loadPatients();
  }, []);

  const submit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.patient_id) {
    alert("Please select a patient");
    return;
  }
    e.preventDefault();

  const formatted: CreateVisitRequest = {
    patientId: form.patient_id,
    clinicianUserId: form.clinician_user_id,
    visitDate: new Date(form.visit_date).toISOString(),
    reason: form.reason,
  };

  await createEncounter(formatted);

  router.push("/staff/appointments");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Schedule Appointment</h1>

      <form onSubmit={submit} style={{ display: "grid", gap: "1rem", maxWidth: "400px" }}>
        <select
          onChange={(e) =>
            setForm({ ...form, patient_id: e.target.value })
          }
        >
          <option value="">Select Patient</option>

          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          onChange={(e) =>
            setForm({ ...form, visit_date: e.target.value })
          }
        />

        <input
          placeholder="Reason"
          onChange={(e) =>
            setForm({ ...form, reason: e.target.value })
          }
        />

        <input
          placeholder="Clinician ID"
          onChange={(e) =>
            setForm({ ...form, clinician_user_id: e.target.value })
          }
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}