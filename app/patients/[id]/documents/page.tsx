"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function DocumentsPage() {
  const params = useParams();
  const patientId = params.id as string;

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      {/* Header */}
      <div className="profile-header">
        <h1>Patient Documents</h1>
        <p className="patient-id">Patient ID: {patientId}</p>
      </div>

      {/* LABS SECTION */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "var(--primary)", marginBottom: "1rem" }}>
          Lab Documents
        </h2>

        <div style={{ marginBottom: "1rem" }}>
          <p>• Blood Test - Jan 2026</p>
          <p>• MRI Scan - Feb 2026</p>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-primary">
            View Lab Files
          </button>

          <button className="btn btn-secondary">
            Upload Lab File
          </button>
        </div>
      </div>

      {/* GENERAL DOCUMENTS */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "var(--primary)", marginBottom: "1rem" }}>
          General Documents
        </h2>

        <div style={{ marginBottom: "1rem" }}>
          <p>• Insurance Form</p>
          <p>• Consent Form</p>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-primary">
            View Files
          </button>

          <button className="btn btn-secondary">
            Upload Document
          </button>
        </div>
      </div>

      {/* AI COPILOT */}
      <div className="card" style={{ textAlign: "center" }}>
        <h2 style={{ color: "var(--primary)", marginBottom: "1rem" }}>
          AI Copilot
        </h2>

        <p style={{ marginBottom: "1rem", color: "var(--gray)" }}>
          Ask AI to summarize patient documents or generate insights.
        </p>

        <button className="btn btn-primary">
          Open AI Copilot
        </button>
      </div>

      {/* Back Button */}
      <div style={{ marginTop: "2rem" }}>
        <Link href={`/patients/${patientId}`} className="btn btn-outline">
          ← Back to Profile
        </Link>
      </div>
    </div>
  );
}
