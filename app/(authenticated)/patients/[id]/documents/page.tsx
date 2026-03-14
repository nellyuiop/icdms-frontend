"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";

type PatientDocument = {
  id: string;
  fileName: string;
  fileUrl?: string;
  type?: string;
  createdAt?: string;
};

export default function PatientDocumentsPage() {
  const { isAdmin, isStaff } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Add document form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "OTHER", fileName: "", fileUrl: "" });
  const [submitting, setSubmitting] = useState(false);

  const canManage = isAdmin || isStaff;

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await api.get<PatientDocument[]>(`/patients/${id}/documents`);
      setDocuments(res.data || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/patients/${id}/documents`, {
        type: form.type,
        fileName: form.fileName,
        fileUrl: form.fileUrl,
      });
      setShowForm(false);
      setForm({ type: "OTHER", fileName: "", fileUrl: "" });
      fetchDocuments();
    } catch (err) {
      console.error("Error creating document:", err);
      alert("Failed to add document.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Delete this document?")) return;
    try {
      await api.delete(`/patients/${id}/documents/${docId}`);
      fetchDocuments();
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete document.");
    }
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
        <h2 style={{ margin: 0 }}>Documents</h2>
        {canManage && (
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
            {showForm ? "Cancel" : "+ Add Document"}
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
          <h3 style={{ marginTop: 0 }}>Add Document</h3>
          <form onSubmit={handleCreate} style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={inputStyle}
              >
                <option value="ID">ID</option>
                <option value="INSURANCE">Insurance</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
                File Name
              </label>
              <input
                value={form.fileName}
                onChange={(e) => setForm({ ...form, fileName: e.target.value })}
                placeholder="e.g. insurance_card.pdf"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
                File URL
              </label>
              <input
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                placeholder="https://..."
                required
                style={inputStyle}
              />
            </div>
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
              {submitting ? "Adding..." : "Add Document"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: "#777" }}>Loading...</p>
      ) : documents.length === 0 ? (
        <p style={{ color: "#777" }}>No documents found</p>
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
              <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px" }}></th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>
                  {doc.fileUrl ? (
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
                      {doc.fileName}
                    </a>
                  ) : (
                    doc.fileName
                  )}
                </td>
                <td style={{ padding: "12px" }}>{doc.type || "—"}</td>
                <td style={{ padding: "12px" }}>
                  {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "—"}
                </td>
                <td style={{ padding: "12px" }}>
                  {canManage && (
                    <button
                      onClick={() => handleDelete(doc.id)}
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
            ))}
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
