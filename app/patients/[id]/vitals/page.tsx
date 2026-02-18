"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function VitalsPage() {
  const params = useParams();
  const patientId = params.id as string;

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <div className="profile-header">
        <h1>Patient Vitals</h1>
        <p className="patient-id">Patient ID: {patientId}</p>
      </div>

      <div className="card">
        <h2 style={{ color: "var(--primary)", marginBottom: "1rem" }}>
          Vital Signs
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div><strong>Blood Pressure:</strong> 120/80</div>
          <div><strong>Heart Rate:</strong> 72 bpm</div>
          <div><strong>Temperature:</strong> 98.6°F</div>
          <div><strong>Respiratory Rate:</strong> 16 breaths/min</div>
          <div><strong>Oxygen Saturation:</strong> 98%</div>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link href={`/patients/${patientId}`} className="btn btn-outline">
          ← Back to Profile
        </Link>
      </div>
    </div>
  );
}
