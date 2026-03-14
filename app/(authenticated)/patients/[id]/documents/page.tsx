"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import { Plus, Trash2, ExternalLink, X } from "lucide-react";

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
      <div className="page-header">
        <h2 className="page-title">Documents</h2>
        {canManage && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`btn ${showForm ? "btn-ghost" : "btn-primary"}`}
          >
            {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Document</>}
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-panel" style={{ maxWidth: "500px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary)", marginBottom: "1rem" }}>
            Add Document
          </h3>
          <form onSubmit={handleCreate} className="form-grid">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="form-input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="ID">ID</option>
                <option value="INSURANCE">Insurance</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">File Name</label>
              <input
                className="form-input"
                value={form.fileName}
                onChange={(e) => setForm({ ...form, fileName: e.target.value })}
                placeholder="e.g. insurance_card.pdf"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">File URL</label>
              <input
                className="form-input"
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>
            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg">
              {submitting ? "Adding..." : "Add Document"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : documents.length === 0 ? (
        <p className="empty-state">No documents found</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Date</th>
                <th style={{ width: "1%" }}></th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    {doc.fileUrl ? (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "var(--accent)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        {doc.fileName} <ExternalLink size={12} />
                      </a>
                    ) : (
                      doc.fileName
                    )}
                  </td>
                  <td>
                    <span className="badge" style={{ background: "var(--gray-100)", color: "var(--gray-600)" }}>
                      {doc.type || "---"}
                    </span>
                  </td>
                  <td>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "---"}</td>
                  <td>
                    {canManage && (
                      <button onClick={() => handleDelete(doc.id)} className="btn btn-sm btn-danger">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
