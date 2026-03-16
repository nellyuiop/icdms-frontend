"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import PatientSubnav from "@/components/PatientSubnav";
import FilePreviewModal from "@/components/FilePreviewModal";
import { ExternalLink, Plus, Trash2, Upload, X } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

type PatientDocument = {
  id: string;
  fileName: string;
  type?: string;
  createdAt?: string;
  mimeType?: string;
  size?: number;
};

type PreviewState = {
  fileName: string;
  mimeType?: string;
  fileUrl: string;
};

const formatFileSize = (size?: number) => {
  if (!size) return "-";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function PatientDocumentsPage() {
  const { isAdmin, isStaff } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [documentType, setDocumentType] = useState("ID");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

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

  useEffect(() => {
    return () => {
      if (preview?.fileUrl) {
        URL.revokeObjectURL(preview.fileUrl);
      }
    };
  }, [preview]);

  const resetForm = () => {
    setDocumentType("ID");
    setSelectedFile(null);
    setFormError("");
  };

  const closePreview = () => {
    if (preview?.fileUrl) {
      URL.revokeObjectURL(preview.fileUrl);
    }
    setPreview(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setFormError("Please choose a file to upload.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("type", documentType);
      formData.append("file", selectedFile);

      await api.post(`/patients/${id}/documents`, formData);
      setShowForm(false);
      resetForm();
      fetchDocuments();
    } catch (error: unknown) {
      console.error("Error uploading document:", error);
      setFormError("Failed to upload document. Make sure the file is PDF, JPG, PNG, or WEBP.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDocument = async (document: PatientDocument) => {
    setOpeningId(document.id);
    setActionError("");

    try {
      const response = await api.get(`/patients/${id}/documents/${document.id}/file`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: document.mimeType || response.headers["content-type"] || "application/octet-stream",
      });
      const blobUrl = URL.createObjectURL(blob);

      if (preview?.fileUrl) {
        URL.revokeObjectURL(preview.fileUrl);
      }

      setPreview({
        fileName: document.fileName,
        mimeType: document.mimeType || response.headers["content-type"] || undefined,
        fileUrl: blobUrl,
      });
    } catch (error) {
      console.error("Error opening document:", error);
      setActionError("Failed to open document.");
    } finally {
      setOpeningId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError("");

    try {
      await api.delete(`/patients/${id}/documents/${deleteTarget}`);
      setDeleteTarget(null);
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      setActionError("Failed to delete document.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PatientSubnav patientId={id} />

      <div className="page-header">
        <h2 className="page-title">Documents</h2>
        {canManage && (
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            className={`btn ${showForm ? "btn-ghost" : "btn-primary"}`}
          >
            {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Upload Document</>}
          </button>
        )}
      </div>

      {actionError && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{actionError}</div>}

      {showForm && (
        <div className="form-panel" style={{ maxWidth: "560px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary)", marginBottom: "1rem" }}>
            Upload Patient Document
          </h3>
          <p style={{ color: "var(--gray-500)", marginBottom: "1rem" }}>
            Upload scans or PDFs for ID, insurance, or other patient paperwork.
          </p>
          {formError && <div className="alert alert-error">{formError}</div>}
          <form onSubmit={handleCreate} className="form-grid">
            <div className="form-group">
              <label className="form-label">Document Type</label>
              <select
                className="form-input"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="ID">ID</option>
                <option value="INSURANCE">Insurance</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">File</label>
              <input
                className="form-input"
                type="file"
                accept="application/pdf,image/png,image/jpeg,image/webp"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                required
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
              {submitting ? "Uploading..." : "Upload Document"}
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
                <th>Size</th>
                <th>Date</th>
                <th style={{ width: "1%" }}></th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <button
                      onClick={() => handleOpenDocument(doc)}
                      className="btn btn-ghost"
                      style={{ padding: 0, display: "inline-flex", alignItems: "center", gap: "4px" }}
                      disabled={openingId === doc.id}
                    >
                      {openingId === doc.id ? "Opening..." : doc.fileName} <ExternalLink size={12} />
                    </button>
                  </td>
                  <td>
                    <span className="badge" style={{ background: "var(--gray-100)", color: "var(--gray-600)" }}>
                      {doc.type || "---"}
                    </span>
                  </td>
                  <td>{formatFileSize(doc.size)}</td>
                  <td>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "---"}</td>
                  <td>
                    {canManage && (
                      <button onClick={() => setDeleteTarget(doc.id)} className="btn btn-sm btn-danger">
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

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
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
