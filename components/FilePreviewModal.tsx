"use client";

import { Download, X } from "lucide-react";

type FilePreviewModalProps = {
  open: boolean;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  onClose: () => void;
};

const isPreviewable = (mimeType?: string) =>
  Boolean(mimeType && (mimeType.startsWith("image/") || mimeType === "application/pdf"));

export default function FilePreviewModal({
  open,
  fileName,
  fileUrl,
  mimeType,
  onClose,
}: FilePreviewModalProps) {
  if (!open) return null;

  const previewable = isPreviewable(mimeType);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(1000px, 92vw)", maxHeight: "90vh", padding: 0, overflow: "hidden" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.9rem 1rem",
            borderBottom: "1px solid var(--gray-200)",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div className="modal-title" style={{ marginBottom: 0 }}>{fileName}</div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <a href={fileUrl} download={fileName} className="btn btn-ghost">
              <Download size={14} /> Download
            </a>
            <button onClick={onClose} className="btn btn-ghost">
              <X size={14} /> Close
            </button>
          </div>
        </div>

        <div style={{ padding: "1rem", maxHeight: "calc(90vh - 72px)", overflow: "auto", background: "#f8fafc" }}>
          {previewable ? (
            mimeType?.startsWith("image/") ? (
              <img
                src={fileUrl}
                alt={fileName}
                style={{ maxWidth: "100%", maxHeight: "calc(90vh - 120px)", display: "block", margin: "0 auto", borderRadius: "8px" }}
              />
            ) : (
              <iframe
                src={fileUrl}
                title={fileName}
                style={{ width: "100%", height: "calc(90vh - 120px)", border: "none", borderRadius: "8px", background: "white" }}
              />
            )
          ) : (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--gray-500)" }}>
              Preview is not available for this file type. Use download to open it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
