"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import PatientSubnav from "@/components/PatientSubnav";
import FilePreviewModal from "@/components/FilePreviewModal";
import { Paperclip, Plus, Trash2, Upload, X } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

type LabData = {
  testName: string;
  result: number;
  unit?: string;
  referenceRange?: string;
  status?: "NORMAL" | "HIGH" | "LOW" | "CRITICAL";
  notes?: string;
  reportDate?: string;
};

type LabAttachment = {
  fileName: string;
  mimeType?: string;
  size?: number;
  fileUrl?: string;
};

type LabRecord = {
  id: string;
  patient_id: string;
  report_date?: string;
  created_at?: string;
  data?: LabData;
  data_json?: string;
  attachment?: LabAttachment | null;
};

type PreviewState = {
  fileName: string;
  mimeType?: string;
  fileUrl: string;
};

const statusBadgeClass: Record<string, string> = {
  NORMAL: "badge badge-normal",
  HIGH: "badge badge-high",
  LOW: "badge badge-low",
  CRITICAL: "badge badge-critical",
};

const formatFileSize = (size?: number) => {
  if (!size) return "-";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
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
    reportDate: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [openingAttachmentId, setOpeningAttachmentId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

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

  useEffect(() => {
    return () => {
      if (preview?.fileUrl) {
        URL.revokeObjectURL(preview.fileUrl);
      }
    };
  }, [preview]);

  const resetForm = () => {
    setForm({
      testName: "",
      result: "",
      unit: "",
      referenceRange: "",
      status: "NORMAL",
      notes: "",
      reportDate: "",
    });
    setSelectedFile(null);
  };

  const closePreview = () => {
    if (preview?.fileUrl) {
      URL.revokeObjectURL(preview.fileUrl);
    }
    setPreview(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("testName", form.testName);
      formData.append("result", form.result);
      if (form.unit) formData.append("unit", form.unit);
      if (form.referenceRange) formData.append("referenceRange", form.referenceRange);
      if (form.status) formData.append("status", form.status);
      if (form.notes) formData.append("notes", form.notes);
      if (form.reportDate) formData.append("reportDate", new Date(form.reportDate).toISOString());
      if (selectedFile) formData.append("file", selectedFile);

      await api.post(`/patients/${id}/labs`, formData);
      setShowForm(false);
      resetForm();
      fetchLabs();
    } catch (error) {
      console.error("Error adding lab result:", error);
      setFormError("Failed to add lab result.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenAttachment = async (lab: LabRecord) => {
    setOpeningAttachmentId(lab.id);
    setActionError("");

    try {
      const response = await api.get(`/patients/${id}/labs/${lab.id}/attachment`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: lab.attachment?.mimeType || response.headers["content-type"] || "application/octet-stream",
      });
      const blobUrl = URL.createObjectURL(blob);

      if (preview?.fileUrl) {
        URL.revokeObjectURL(preview.fileUrl);
      }

      setPreview({
        fileName: lab.attachment?.fileName || `lab-${lab.id}`,
        mimeType: lab.attachment?.mimeType || response.headers["content-type"] || undefined,
        fileUrl: blobUrl,
      });
    } catch (error) {
      console.error("Error opening lab attachment:", error);
      setActionError("Failed to open lab attachment.");
    } finally {
      setOpeningAttachmentId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError("");
    try {
      await api.delete(`/patients/${id}/labs/${deleteTarget}`);
      setDeleteTarget(null);
      fetchLabs();
    } catch (error) {
      console.error("Error deleting lab result:", error);
      setActionError("Failed to delete lab result.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
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
      <PatientSubnav patientId={id} />

      <div className="page-header">
        <h2 className="page-title">Lab Results</h2>
        {canUpload && (
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setFormError("");
                resetForm();
              }
            }}
            className={`btn ${showForm ? "btn-ghost" : "btn-primary"}`}
          >
            {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Result</>}
          </button>
        )}
      </div>

      {actionError && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{actionError}</div>}

      {showForm && (
        <div className="form-panel" style={{ maxWidth: "560px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary)", marginBottom: "1rem" }}>
            Add Lab Result
          </h3>
          <p style={{ color: "var(--gray-500)", marginBottom: "1rem" }}>
            Enter the lab result details below. You can optionally attach the original report.
          </p>
          {formError && <div className="alert alert-error">{formError}</div>}
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
              <label className="form-label">Report Date</label>
              <input
                className="form-input"
                type="datetime-local"
                value={form.reportDate}
                onChange={(e) => setForm({ ...form, reportDate: e.target.value })}
              />
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
            <div className="form-group">
              <label className="form-label">Attach Report (optional)</label>
              <input
                className="form-input"
                type="file"
                accept="application/pdf,image/png,image/jpeg,image/webp"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <small style={{ color: "var(--gray-500)" }}>
                Accepted formats: PDF, JPG, PNG, WEBP. Max size: 10 MB.
              </small>
            </div>
            {selectedFile && (
              <div className="alert" style={{ background: "var(--gray-50)", color: "var(--gray-600)" }}>
                <Upload size={14} /> {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </div>
            )}
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
                <th>Attachment</th>
                <th>Date</th>
                <th style={{ width: "1%" }}></th>
              </tr>
            </thead>
            <tbody>
              {labs.map((lab) => {
                const data = getLabData(lab);
                const labStatus = data?.status || "NORMAL";
                const displayDate = data?.reportDate || lab.report_date || lab.created_at;

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
                      {lab.attachment ? (
                        <button
                          onClick={() => handleOpenAttachment(lab)}
                          className="btn btn-ghost"
                          style={{ padding: 0, display: "inline-flex", alignItems: "center", gap: "4px" }}
                          disabled={openingAttachmentId === lab.id}
                        >
                          {openingAttachmentId === lab.id ? "Opening..." : (
                            <>
                              <Paperclip size={12} /> View report
                            </>
                          )}
                        </button>
                      ) : (
                        <span style={{ color: "var(--gray-400)" }}>---</span>
                      )}
                    </td>
                    <td>{displayDate ? new Date(displayDate).toLocaleString() : "---"}</td>
                    <td>
                      {canDelete && (
                        <button onClick={() => setDeleteTarget(lab.id)} className="btn btn-sm btn-danger">
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

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Lab Result"
        message="Are you sure you want to delete this lab result? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <FilePreviewModal
        open={!!preview}
        fileName={preview?.fileName || ""}
        fileUrl={preview?.fileUrl || ""}
        mimeType={preview?.mimeType}
        onClose={closePreview}
      />
    </div>
  );
}
