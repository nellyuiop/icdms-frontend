"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function AddVisitPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    reason: "",
    provider: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/patients/${patientId}/visits`);
      }, 2000);
    }, 1000);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1
        style={{ fontSize: "2rem", color: "#0b2b4a", marginBottom: "0.5rem" }}
      >
        Add New Visit
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Patient ID: {patientId}
      </p>

      {success && (
        <div
          style={{
            background: "#d4edda",
            color: "#155724",
            padding: "1rem",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          ✓ Visit added successfully! Redirecting...
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Visit Date *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Reason for Visit *
          </label>
          <select
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <option value="">Select reason</option>
            <option value="Check-up">Check-up</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Emergency">Emergency</option>
            <option value="Consultation">Consultation</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Provider *
          </label>
          <select
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <option value="">Select provider</option>
            <option value="Dr. Williams">Dr. Williams</option>
            <option value="Dr. Chen">Dr. Chen</option>
            <option value="Dr. Patel">Dr. Patel</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder="Enter any additional notes..."
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.5rem 1rem",
              background: loading ? "#ccc" : "#0b2b4a",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Adding..." : "Add Visit"}
          </button>
          <Link
            href={`/patients/${patientId}`}
            style={{
              padding: "0.5rem 1rem",
              background: "#6c757d",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
