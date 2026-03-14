"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import { Plus, Trash2, X } from "lucide-react";

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

const statusBadgeClass: Record<string, string> = {
  NORMAL: "badge badge-normal",
  HIGH: "badge badge-high",
  LOW: "badge badge-low",
  CRITICAL: "badge badge-critical",
};

export default function PatientLabsPage() {
  const { isAdmin, isStaff } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const [labs, setLabs] = useState<LabRecord[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="page-header">
        <h2 className="page-title">Lab Results</h2>
        {canUpload && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`btn ${showForm ? "btn-ghost" : "btn-primary"}`}
          >
            {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Result</>}
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-panel" style={{ maxWidth: "500px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary)", marginBottom: "1rem" }}>
            Add Lab Result
          </h3>
          <form onSubmit={handleCreate} className="form-grid">
            <div className="form-group">
              <label className="form-label">Test Name</label>
              <input
                className="form-input"
                placeholder="e.g. CBC, BMP"
                value={form.testName}
                onChange={(e) => setForm({ ...form, testName: e.target.value })}
                required
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Result</label>
                <input
                  className="form-input"
                  type="number"
                  step="any"
                  placeholder="Value"
                  value={form.result}
                  onChange={(e) => setForm({ ...form, result: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <input
                  className="form-input"
                  placeholder="e.g. mg/dL"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Reference Range</label>
                <input
                  className="form-input"
                  placeholder="e.g. 70-100"
                  value={form.referenceRange}
                  onChange={(e) => setForm({ ...form, referenceRange: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as LabData["status"] })}
                >
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="LOW">Low</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <input
                className="form-input"
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg">
              {submitting ? "Adding..." : "Add Lab Result"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : labs.length === 0 ? (
        <p className="empty-state">No lab results found</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Test</th>
                <th>Value</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: "1%" }}></th>
              </tr>
            </thead>
            <tbody>
              {labs.map((lab) => {
                const data = getLabData(lab);
                const labStatus = data?.status || "NORMAL";
                return (
                  <tr key={lab.id}>
                    <td style={{ fontWeight: 500 }}>{data?.testName || "---"}</td>
                    <td>
                      {data?.result ?? "---"}{" "}
                      <span style={{ color: "var(--gray-400)" }}>{data?.unit || ""}</span>
                    </td>
                    <td>
                      {data?.status && (
                        <span className={statusBadgeClass[labStatus] || "badge"}>
                          {data.status}
                        </span>
                      )}
                    </td>
                    <td>
                      {(lab.report_date || lab.created_at)
                        ? new Date(lab.report_date || lab.created_at!).toLocaleDateString()
                        : "---"}
                    </td>
                    <td>
                      {canDelete && (
                        <button onClick={() => handleDelete(lab.id)} className="btn btn-sm btn-danger">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
