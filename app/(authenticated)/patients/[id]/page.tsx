"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";

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
  const id = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    } catch (err) {
      console.error("Error updating patient:", err);
      alert("Failed to update patient.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/patients/${id}`);
      router.push("/patients");
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert("Failed to delete patient.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;
  if (error) return <p style={{ padding: "2rem", color: "#dc2626" }}>{error}</p>;
  if (!patient) return null;

  const tabs = [
    { label: "Documents", href: `/patients/${id}/documents` },
    { label: "Labs", href: `/patients/${id}/labs` },
    { label: "Visits", href: `/patients/${id}/visits` },
  ];

  return (
    <div>
      <button
        onClick={() => router.push("/patients")}
        style={{
          background: "none",
          border: "none",
          color: "#2563eb",
          cursor: "pointer",
          marginBottom: "1rem",
          fontSize: "0.9rem",
        }}
      >
        ← Back to Patients
      </button>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ margin: 0, color: "#0b2b4a" }}>
            {patient.name || "Unknown Patient"}
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            {canEdit && !editing && (
              <button
                onClick={() => setEditing(true)}
                style={{
                  padding: "6px 14px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => setDeleteConfirm(true)}
                style={{
                  padding: "6px 14px",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {editing ? (
          <div style={{ display: "grid", gap: "1rem", maxWidth: "500px" }}>
            <input
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Name"
              style={inputStyle}
            />
            <input
              type="date"
              value={editForm.dob}
              onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
              style={inputStyle}
            />
            <select
              value={editForm.gender}
              onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
              style={inputStyle}
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <textarea
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              placeholder="Notes"
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "8px 16px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: "8px 16px",
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>Date of Birth</div>
              <div>{new Date(patient.dob).toLocaleDateString()}</div>
            </div>
            <div>
              <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>Gender</div>
              <div>{patient.gender || "—"}</div>
            </div>
            {patient.external_id && (
              <div>
                <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>External ID</div>
                <div>{patient.external_id}</div>
              </div>
            )}
            {patient.notes && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>Notes</div>
                <div>{patient.notes}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tab links */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              padding: "10px 20px",
              background: "white",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#0b2b4a",
              border: "1px solid #e5e7eb",
              fontWeight: 500,
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => !deleting && setDeleteConfirm(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "30px",
              maxWidth: "420px",
              width: "90%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: "12px" }}>Delete Patient</h3>
            <p style={{ color: "#555", marginBottom: "24px" }}>
              Are you sure you want to delete{" "}
              <strong>{patient.name || "this patient"}</strong>? This action cannot
              be undone.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setDeleteConfirm(false)}
                disabled={deleting}
                style={{
                  padding: "8px 16px",
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: "8px 16px",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: deleting ? "not-allowed" : "pointer",
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
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
