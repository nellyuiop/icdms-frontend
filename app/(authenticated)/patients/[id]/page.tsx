"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  FileText,
  FlaskConical,
  Activity,
  Save,
  X,
} from "lucide-react";

type Patient = {
  id: string;
  name?: string;
  dob: string;
  gender?: string | null;
  notes?: string | null;
  external_id?: string;
};

export default function PatientDetailPage() {
  const { isAdmin, isClinician } = useAuth();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const id = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", dob: "", gender: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canDelete = isAdmin || isClinician;
  const canEdit = isAdmin;

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await api.get<Patient>(`/patients/${id}`);
        setPatient(res.data);
        setEditForm({
          name: res.data.name || "",
          dob: res.data.dob?.split("T")[0] || "",
          gender: res.data.gender || "",
          notes: res.data.notes || "",
        });
      } catch (err) {
        console.error("Error fetching patient:", err);
        setError("Patient not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch<Patient>(`/patients/${id}`, editForm);
      setPatient(res.data);
      setEditing(false);
    } catch {
      setActionError("Failed to update patient.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/patients/${id}`);
      router.push("/patients");
    } catch {
      setActionError("Failed to delete patient.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!patient) return null;

  const tabs = [
    { label: "Documents", href: `/patients/${id}/documents`, icon: FileText },
    { label: "Labs", href: `/patients/${id}/labs`, icon: FlaskConical },
    { label: "Visits", href: `/patients/${id}/visits`, icon: Activity },
  ];

  return (
    <div>
      {actionError && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{actionError}</div>}

      <button onClick={() => router.push("/patients")} className="btn btn-ghost" style={{ marginBottom: "1rem" }}>
        <ArrowLeft size={14} /> Back to Patients
      </button>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <h2 className="page-title">{patient.name || "Unknown Patient"}</h2>
          <div style={{ display: "flex", gap: "6px" }}>
            {canEdit && !editing && (
              <button onClick={() => setEditing(true)} className="btn btn-sm btn-primary">
                <Pencil size={13} /> Edit
              </button>
            )}
            {canDelete && (
              <button onClick={() => setDeleteConfirm(true)} className="btn btn-sm btn-danger">
                <Trash2 size={13} /> Delete
              </button>
            )}
          </div>
        </div>

        {editing ? (
          <div className="form-grid" style={{ maxWidth: "480px" }}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  className="form-input"
                  type="date"
                  value={editForm.dob}
                  onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-input"
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                <Save size={14} /> {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setEditing(false)} className="btn btn-ghost">
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="detail-grid">
            <div>
              <div className="detail-item-label">Date of Birth</div>
              <div className="detail-item-value">{new Date(patient.dob).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="detail-item-label">Gender</div>
              <div className="detail-item-value">
                {patient.gender ? patient.gender.charAt(0) + patient.gender.slice(1).toLowerCase() : "---"}
              </div>
            </div>
            {patient.external_id && (
              <div>
                <div className="detail-item-label">External ID</div>
                <div className="detail-item-value" style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>
                  {patient.external_id}
                </div>
              </div>
            )}
            {patient.notes && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="detail-item-label">Notes</div>
                <div className="detail-item-value">{patient.notes}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="tab-nav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`tab-link${active ? " active" : ""}`}
            >
              <Icon size={15} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteConfirm(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete Patient</h3>
            <p className="modal-body">
              Are you sure you want to delete{" "}
              <strong>{patient.name || "this patient"}</strong>? This action cannot
              be undone.
            </p>
            <div className="modal-actions">
              <button onClick={() => setDeleteConfirm(false)} disabled={deleting} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting} className="btn btn-danger">
                <Trash2 size={14} /> {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
