"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";

type LabData = {
  testName: string;
  result: number;
  unit?: string;
  referenceRange?: string;
  status?: "NORMAL" | "HIGH" | "LOW" | "CRITICAL";
  notes?: string;
};

type LabRecord = {
  id: string;
  patient_id: string;
  report_date?: string;
  created_at?: string;
  data?: LabData;
  data_json?: string;
};

const statusBadge: Record<string, { bg: string; color: string }> = {
  NORMAL: { bg: "#d1fae5", color: "#065f46" },
  HIGH: { bg: "#fef3c7", color: "#b45309" },
  LOW: { bg: "#dbeafe", color: "#1e40af" },
  CRITICAL: { bg: "#fef2f2", color: "#dc2626" },
};

export default function PatientLabsPage() {
  const { isAdmin, isStaff } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const [labs, setLabs] = useState<LabRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Add lab form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    testName: "",
    result: "",
    unit: "",
    referenceRange: "",
    status: "NORMAL" as LabData["status"],
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const canUpload = isAdmin || isStaff;
  const canDelete = isAdmin;

  const fetchLabs = useCallback(async () => {
    try {
      const res = await api.get<LabRecord[]>(`/patients/${id}/labs`);
      setLabs(res.data || []);
    } catch (err) {
      console.error("Error fetching labs:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/patients/${id}/labs`, {
        testName: form.testName,
        result: Number(form.result),
        unit: form.unit || undefined,
        referenceRange: form.referenceRange || undefined,
        status: form.status || undefined,
        notes: form.notes || undefined,
      });
      setShowForm(false);
      setForm({ testName: "", result: "", unit: "", referenceRange: "", status: "NORMAL", notes: "" });
      fetchLabs();
    } catch (err) {
      console.error("Error creating lab:", err);
      alert("Failed to add lab result.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (labId: string) => {
    if (!confirm("Delete this lab result?")) return;
    try {
      await api.delete(`/patients/${id}/labs/${labId}`);
      fetchLabs();
    } catch (err) {
      console.error("Error deleting lab:", err);
      alert("Failed to delete lab result.");
    }
  };

  const getLabData = (lab: LabRecord): LabData | null => {
    if (lab.data) return lab.data;
    if (lab.data_json) {
      try {
        return JSON.parse(lab.data_json);
      } catch {
        return null;
      }
    }
    return null;
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ margin: 0 }}>Lab Results</h2>
        {canUpload && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: "8px 16px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {showForm ? "Cancel" : "+ Add Lab Result"}
          </button>
        )}
      </div>

      {showForm && (
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginBottom: "1.5rem",
            maxWidth: "500px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Add Lab Result</h3>
          <form onSubmit={handleCreate} style={{ display: "grid", gap: "1rem" }}>
            <input
              placeholder="Test Name (e.g. CBC, BMP)"
              value={form.testName}
              onChange={(e) => setForm({ ...form, testName: e.target.value })}
              required
              style={inputStyle}
            />
            <input
              type="number"
              step="any"
              placeholder="Result value"
              value={form.result}
              onChange={(e) => setForm({ ...form, result: e.target.value })}
              required
              style={inputStyle}
            />
            <input
              placeholder="Unit (e.g. mg/dL)"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Reference Range (e.g. 70-100)"
              value={form.referenceRange}
              onChange={(e) => setForm({ ...form, referenceRange: e.target.value })}
              style={inputStyle}
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as LabData["status"] })}
              style={inputStyle}
            >
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="LOW">Low</option>
              <option value="CRITICAL">Critical</option>
            </select>
            <input
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={inputStyle}
            />
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
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Adding..." : "Add Lab Result"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: "#777" }}>Loading...</p>
      ) : labs.length === 0 ? (
        <p style={{ color: "#777" }}>No lab results found</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead style={{ background: "#f4f6f8" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>Test</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Value</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px" }}></th>
            </tr>
          </thead>
          <tbody>
            {labs.map((lab) => {
              const data = getLabData(lab);
              const labStatus = data?.status || "NORMAL";
              const badge = statusBadge[labStatus] || statusBadge.NORMAL;
              return (
                <tr key={lab.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{data?.testName || "—"}</td>
                  <td style={{ padding: "12px" }}>
                    {data?.result ?? "—"} {data?.unit || ""}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {data?.status && (
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          background: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {data.status}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {(lab.report_date || lab.created_at)
                      ? new Date(lab.report_date || lab.created_at!).toLocaleDateString()
                      : "—"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(lab.id)}
                        style={{
                          padding: "4px 10px",
                          background: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};
