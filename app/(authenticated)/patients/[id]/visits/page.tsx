"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import PatientSubnav from "@/components/PatientSubnav";
import FilePreviewModal from "@/components/FilePreviewModal";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Play,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

type EncounterApiRecord = {
  id: string;
  patient?: { id?: string; name?: string };
  patient_id?: string;
  visit_date?: string;
  scheduledAt?: string;
  status: string;
  clinician?: { name?: string };
  notes?: string;
  reason?: string | null;
  vitals?: VitalRecord[];
  documents?: PatientDocumentSummary[];
};

type VitalRecord = {
  id: number;
  visitId?: string | null;
  recordedAt?: string;
  bloodPressureSystolic?: number | null;
  bloodPressureDiastolic?: number | null;
  heartRate?: number | null;
  temperature?: number | null;
  respiratoryRate?: number | null;
  oxygenSaturation?: number | null;
};

type VitalDisplay = {
  label: string;
  value: string;
};

type PatientSummary = {
  id: string;
  name?: string;
  external_id?: string;
};

type PatientDocumentSummary = {
  id: string;
  patientId: string;
  type?: string;
  fileName: string;
  fileUrl?: string;
  accessUrl?: string;
  fileUrlExpiresAt?: string;
  mimeType?: string;
  size?: number;
  createdAt?: string;
};

type MockDetection = {
  label: string;
  value: string;
  confidence?: string;
};

type VitalsFormState = {
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  heartRate: string;
  temperature: string;
  respiratoryRate: string;
  oxygenSaturation: string;
};

type PreviewState = {
  fileName: string;
  mimeType?: string;
  fileUrl: string;
};

type SignedFileAccessResponse = {
  url: string;
  expiresAt?: string;
  expiresIn?: number;
  fileName?: string;
  mimeType?: string;
};

const emptyVitalsForm = (): VitalsFormState => ({
  bloodPressureSystolic: "",
  bloodPressureDiastolic: "",
  heartRate: "",
  temperature: "",
  respiratoryRate: "",
  oxygenSaturation: "",
});

const revokePreviewUrl = (fileUrl?: string) => {
  if (fileUrl?.startsWith("blob:")) {
    URL.revokeObjectURL(fileUrl);
  }
};

const formatFileSize = (size?: number) => {
  if (!size) return "-";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getVisitDocumentBadgeLabel = (type?: string) => {
  const normalizedType = (type || "").trim().toUpperCase();
  if (!normalizedType || normalizedType === "OTHER") {
    return null;
  }

  return normalizedType.replaceAll("_", " ");
};

const buildVitalRows = (record?: VitalRecord | null): VitalDisplay[] => {
  if (!record) {
    return [];
  }

  const rows: VitalDisplay[] = [];

  if (
    record.bloodPressureSystolic != null &&
    record.bloodPressureDiastolic != null
  ) {
    rows.push({
      label: "Blood Pressure",
      value: `${record.bloodPressureSystolic}/${record.bloodPressureDiastolic} mmHg`,
    });
  }
  if (record.heartRate != null) {
    rows.push({ label: "Heart Rate", value: `${record.heartRate} bpm` });
  }
  if (record.temperature != null) {
    rows.push({ label: "Temperature", value: `${record.temperature} C` });
  }
  if (record.respiratoryRate != null) {
    rows.push({
      label: "Respiratory Rate",
      value: `${record.respiratoryRate} /min`,
    });
  }
  if (record.oxygenSaturation != null) {
    rows.push({
      label: "O2 Saturation",
      value: `${record.oxygenSaturation}%`,
    });
  }

  return rows;
};

const splitNoteEntries = (value: string) =>
  value
    .split(/\n\s*\n+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

const joinNoteEntries = (entries: string[]) => entries.map((entry) => entry.trim()).filter(Boolean).join("\n\n");

const mergeNoteEntries = (existingEntries: string[], nextEntry: string) => {
  const normalizedEntry = nextEntry.trim();
  return normalizedEntry ? [...existingEntries, normalizedEntry] : existingEntries;
};

const statusBadgeClass = (status: string) => {
  const normalizedStatus = status.toLowerCase().replace("_", "-");
  if (normalizedStatus === "scheduled") return "badge badge-scheduled";
  if (normalizedStatus === "checked-in") return "badge badge-checked-in";
  if (normalizedStatus === "in-progress") return "badge badge-in-progress";
  if (normalizedStatus === "completed") return "badge badge-completed";
  if (normalizedStatus === "cancelled") return "badge badge-cancelled";
  return "badge";
};

const formatVisitDate = (value?: string) =>
  new Date(value || Date.now()).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatDateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "---";

const AI_OBSERVATIONS_HEADING = "AI Extracted Observations:";
const clinicallyRelevantVisitStatuses = new Set(["IN_PROGRESS", "COMPLETED"]);

const formatAiObservationsBlock = (observations: string[]) =>
  `${AI_OBSERVATIONS_HEADING}\n${observations.map((item) => `- ${item}`).join("\n")}`;

const mergeVisitNotesWithObservations = (
  existingNotes: string,
  observations: string[]
) => {
  const trimmedNotes = existingNotes.trim();
  const baseNotes = trimmedNotes.includes(AI_OBSERVATIONS_HEADING)
    ? trimmedNotes.split(AI_OBSERVATIONS_HEADING)[0].trimEnd()
    : trimmedNotes;

  if (observations.length === 0) {
    return baseNotes;
  }

  const observationsBlock = formatAiObservationsBlock(observations);
  return baseNotes ? `${baseNotes}\n\n${observationsBlock}` : observationsBlock;
};

const parseVisitNotes = (notes?: string | null) => {
  const rawNotes = notes?.trim() || "";

  if (!rawNotes.includes(AI_OBSERVATIONS_HEADING)) {
    return {
      clinicianNotes: rawNotes,
      aiObservations: [] as string[],
    };
  }

  const [baseNotes, aiBlock] = rawNotes.split(AI_OBSERVATIONS_HEADING);
  const aiObservations = (aiBlock || "")
    .split("\n")
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean);

  return {
    clinicianNotes: baseNotes.trim(),
    aiObservations,
  };
};

const sectionLabelStyle = {
  color: "var(--gray-500)",
  fontSize: "0.78rem",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  marginBottom: "0.5rem",
};

const noteCardStyle = {
  border: "1px solid var(--gray-200)",
  borderRadius: "12px",
  padding: "0.85rem 0.95rem",
  background: "var(--gray-50)",
};

const noteEntryCardStyle = {
  ...noteCardStyle,
  border: "1px solid rgba(148, 163, 184, 0.28)",
  borderLeft: "4px solid rgba(37, 99, 235, 0.55)",
  background: "#ffffff",
};

const noteEntryBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "0.18rem 0.5rem",
  borderRadius: "999px",
  background: "rgba(37, 99, 235, 0.08)",
  color: "rgba(30, 64, 175, 0.9)",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
};

const noteComposerStyle = {
  paddingTop: "0.25rem",
};

export default function PatientVisitsPage() {
  const { isAdmin, isClinician } = useAuth();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const aiUploadInputRef = useRef<HTMLInputElement | null>(null);
  const id = params.id as string;
  const activeVisitId = searchParams.get("activeVisit");

  const [visits, setVisits] = useState<EncounterApiRecord[]>([]);
  const [patient, setPatient] = useState<PatientSummary | null>(null);
  const [latestVital, setLatestVital] = useState<VitalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [savedNoteEntries, setSavedNoteEntries] = useState<string[]>([]);
  const [newNoteEntry, setNewNoteEntry] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);
  const [vitalsSubmitting, setVitalsSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSourceFile, setAiSourceFile] = useState<File | null>(null);
  const [detectedVitals, setDetectedVitals] = useState<MockDetection[]>([]);
  const [others, setOthers] = useState<string[]>([]);
  const [savedAiObservations, setSavedAiObservations] = useState<string[]>([]);
  const [pendingVitalsForm, setPendingVitalsForm] = useState<VitalsFormState>(emptyVitalsForm);
  const [aiWarning, setAiWarning] = useState("");
  const [vitalsForm, setVitalsForm] = useState<VitalsFormState>(emptyVitalsForm);
  const [openingDocumentId, setOpeningDocumentId] = useState<string | null>(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null);
  const [confirmingDeleteDocumentId, setConfirmingDeleteDocumentId] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const canStartVisit = isAdmin || isClinician;
  const canDocumentVisit = isAdmin || isClinician;

  const fetchData = useCallback(async () => {
    setActionError("");
    try {
      const [patientRes, encountersRes, vitalsRes] = await Promise.allSettled([
        api.get<PatientSummary>(`/patients/${id}`),
        api.get<EncounterApiRecord[]>("/encounters"),
        api.get<VitalRecord[]>(`/patients/${id}/vitals`),
      ]);

      if (patientRes.status === "fulfilled") {
        setPatient(patientRes.value.data);
      } else {
        const status = axios.isAxiosError(patientRes.reason)
          ? patientRes.reason.response?.status
          : undefined;
        if (status !== 500) {
          console.error("Error fetching patient:", patientRes.reason);
        }
        setActionError("Failed to load the patient record.");
        return;
      }

      if (vitalsRes.status === "fulfilled") {
        setLatestVital(vitalsRes.value.data?.[0] || null);
      } else {
        const status = axios.isAxiosError(vitalsRes.reason)
          ? vitalsRes.reason.response?.status
          : undefined;
        if (status !== 500) {
          console.error("Error fetching latest vitals:", vitalsRes.reason);
        }
        setLatestVital(null);
      }

      if (encountersRes.status !== "fulfilled") {
        const status = axios.isAxiosError(encountersRes.reason)
          ? encountersRes.reason.response?.status
          : undefined;
        if (status !== 500) {
          console.error("Error fetching visits:", encountersRes.reason);
        }
        setVisits([]);
        setActionError(
          status === 500
            ? "Visits are temporarily unavailable. Refresh after the backend restarts."
            : "Failed to load visits."
        );
        return;
      }

      const patientVisits = (encountersRes.value.data || []).filter((enc) => {
        const belongsToPatient = enc.patient?.id === id || enc.patient_id === id;
        const normalizedStatus = (enc.status || "").toUpperCase();

        return belongsToPatient && clinicallyRelevantVisitStatuses.has(normalizedStatus);
      });
      setVisits(patientVisits);
    } catch (err) {
      console.error("Error fetching visits:", err);
      setActionError("Failed to load visits.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const activeVisit = useMemo(
    () => visits.find((visit) => visit.id === activeVisitId) || null,
    [visits, activeVisitId]
  );
  const latestVitalRows = useMemo(() => buildVitalRows(latestVital), [latestVital]);
  const activeVisitDocuments = activeVisit?.documents || [];
  const isAbnormal = {
    heartRate: Number(vitalsForm.heartRate) > 100,
    temperature: Number(vitalsForm.temperature) > 38,
    oxygenSaturation: Number(vitalsForm.oxygenSaturation) < 95,
  };

  useEffect(() => {
    const parsedNotes = parseVisitNotes(activeVisit?.notes);
    setSavedNoteEntries(splitNoteEntries(parsedNotes.clinicianNotes));
    setNewNoteEntry("");
    setSavedAiObservations(parsedNotes.aiObservations);
    if (activeVisit) {
      setExpandedVisit(activeVisit.id);
    }
    setAiSourceFile(null);
    setDetectedVitals([]);
    setOthers([]);
    setPendingVitalsForm(emptyVitalsForm());
    setAiWarning("");
    setAiLoading(false);
  }, [activeVisit]);

  useEffect(() => {
    return () => {
      revokePreviewUrl(preview?.fileUrl);
    };
  }, [preview]);

  const handleStartVisit = async (visitId: string, patientId: string) => {
    setActionError("");
    try {
      await api.patch(`/encounters/${visitId}/start`);
      await fetchData();
      router.push(`/patients/${patientId}/visits?activeVisit=${visitId}`);
    } catch {
      setActionError("Failed to start visit.");
    }
  };

  const handleSaveNotes = async () => {
    if (!activeVisit) return;
    setNotesSaving(true);
    setActionError("");

    const nextEntries = mergeNoteEntries(savedNoteEntries, newNoteEntry);
    const mergedNotes = mergeVisitNotesWithObservations(
      joinNoteEntries(nextEntries),
      savedAiObservations
    );

    try {
      await api.patch(`/encounters/${activeVisit.id}/status`, {
        status: activeVisit.status,
        notes: mergedNotes,
      });
      setSavedNoteEntries(nextEntries);
      setNewNoteEntry("");
      await fetchData();
    } catch {
      setActionError("Failed to save visit notes.");
    } finally {
      setNotesSaving(false);
    }
  };

  const handleAddVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVisit) return;
    setVitalsSubmitting(true);
    setActionError("");

    const observationsToPersist = others.length > 0 ? others : savedAiObservations;
    const noteEntriesToPersist = mergeNoteEntries(savedNoteEntries, newNoteEntry);
    const mergedNotes = mergeVisitNotesWithObservations(
      joinNoteEntries(noteEntriesToPersist),
      observationsToPersist
    );

    const payload = {
      bloodPressureSystolic: vitalsForm.bloodPressureSystolic
        ? Number(vitalsForm.bloodPressureSystolic)
        : undefined,
      bloodPressureDiastolic: vitalsForm.bloodPressureDiastolic
        ? Number(vitalsForm.bloodPressureDiastolic)
        : undefined,
      heartRate: vitalsForm.heartRate ? Number(vitalsForm.heartRate) : undefined,
      temperature: vitalsForm.temperature
        ? Number(vitalsForm.temperature)
        : undefined,
      respiratoryRate: vitalsForm.respiratoryRate
        ? Number(vitalsForm.respiratoryRate)
        : undefined,
      oxygenSaturation: vitalsForm.oxygenSaturation
        ? Number(vitalsForm.oxygenSaturation)
        : undefined,
    };

    try {
      if (mergedNotes) {
        await api.patch(`/encounters/${activeVisit.id}/status`, {
          status: activeVisit.status,
          notes: mergedNotes,
        });
        setSavedAiObservations(observationsToPersist);
        setSavedNoteEntries(noteEntriesToPersist);
        setNewNoteEntry("");
      }

      await api.post(`/encounters/${activeVisit.id}/vitals`, payload);
      let visitDocumentSaveFailed = false;

      if (aiSourceFile) {
        const documentFormData = new FormData();
        documentFormData.append("file", aiSourceFile);

        try {
          await api.post<PatientDocumentSummary>(
            `/encounters/${activeVisit.id}/documents`,
            documentFormData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          setAiSourceFile(null);
          setDetectedVitals([]);
          setOthers([]);
          setPendingVitalsForm(emptyVitalsForm());
          setAiWarning("");
        } catch (error) {
          const status = axios.isAxiosError(error)
            ? error.response?.status
            : undefined;

          if (status !== 500) {
            console.error("Error saving AI source document to visit:", error);
          }

          visitDocumentSaveFailed = true;
        }
      }

      setVitalsForm(emptyVitalsForm());
      await fetchData();

      if (visitDocumentSaveFailed) {
        setActionError(
          "Vitals were saved, but the AI source document could not be attached to this visit yet."
        );
      }
    } catch {
      setActionError("Failed to record vitals.");
    } finally {
      setVitalsSubmitting(false);
    }
  };

  const handleCompleteVisit = async () => {
    if (!activeVisit) return;
    setActionError("");
    try {
      await api.patch(`/encounters/${activeVisit.id}/complete`);
      await fetchData();
      router.push(`/patients/${id}/visits`);
    } catch {
      setActionError("Failed to complete visit.");
    }
  };

  const handleAiUploadClick = () => {
    aiUploadInputRef.current?.click();
  };

  const handleAiSourceSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file || !activeVisit) return;

    setAiSourceFile(file);
    setAiLoading(true);
    setAiWarning("");
    setDetectedVitals([]);
    setOthers([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(
        `/encounters/${activeVisit.id}/vitals/extract`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const result = res.data;
      const payload = result?.data ?? result;
      const extracted = payload?.predefinedVitals ?? payload;

      setPendingVitalsForm({
        bloodPressureSystolic: extracted.bloodPressureSystolic?.toString() || "",
        bloodPressureDiastolic: extracted.bloodPressureDiastolic?.toString() || "",
        heartRate: extracted.heartRate?.toString() || "",
        temperature: extracted.temperature?.toString() || "",
        respiratoryRate: extracted.respiratoryRate?.toString() || "",
        oxygenSaturation: extracted.oxygenSaturation?.toString() || "",
      });

      setDetectedVitals(payload?.detectedVitals || []);
      setOthers(payload?.others || []);

      if (payload?.source?.usedMock) {
        setAiWarning("AI unavailable - showing mock data.");
      }
    } catch (err) {
      console.error(err);
      setAiWarning("Failed to extract vitals.");
    } finally {
      setAiLoading(false);
      e.target.value = "";
    }
  };

  const handleOpenVisitDocument = async (document: PatientDocumentSummary) => {
    setOpeningDocumentId(document.id);
    setActionError("");

    try {
      const accessUrl = document.accessUrl || `/patients/${id}/documents/${document.id}/file`;
      const response = await api.get<SignedFileAccessResponse>(accessUrl);
      const signedUrl = response.data?.url || document.fileUrl;

      if (!signedUrl) {
        throw new Error("Missing signed document URL");
      }

      revokePreviewUrl(preview?.fileUrl);
      setPreview({
        fileName: response.data?.fileName || document.fileName,
        mimeType: response.data?.mimeType || document.mimeType,
        fileUrl: signedUrl,
      });
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;

      if (status !== 404) {
        console.error("Error opening document from visits:", error);
      }

      setActionError(
        status === 404
          ? "One of the saved documents is missing from storage. Please re-upload it from the Documents tab."
          : "Failed to open document."
      );
    } finally {
      setOpeningDocumentId(null);
    }
  };

  const handleDeleteVisitDocument = async (visitId: string, document: PatientDocumentSummary) => {
    setDeletingDocumentId(document.id);
    setConfirmingDeleteDocumentId(null);
    setActionError("");

    try {
      await api.delete(`/patients/${document.patientId || id}/documents/${document.id}`);
      setVisits((currentVisits) =>
        currentVisits.map((visit) =>
          visit.id === visitId
            ? {
                ...visit,
                documents: (visit.documents || []).filter(
                  (visitDocument) => visitDocument.id !== document.id
                ),
              }
            : visit
        )
      );
    } catch (error) {
      console.error("Error deleting visit document:", error);
      setActionError("Failed to remove document from this visit.");
    } finally {
      setDeletingDocumentId(null);
    }
  };

  const closePreview = () => {
    revokePreviewUrl(preview?.fileUrl);
    setPreview(null);
  };

  const requestDeleteVisitDocument = (documentId: string) => {
    setConfirmingDeleteDocumentId((current) =>
      current === documentId ? null : documentId
    );
  };

  const hasPendingDetectedValues = Object.values(pendingVitalsForm).some(Boolean);

  const applyDetectedValuesToForm = () => {
    if (!hasPendingDetectedValues) return;
    setVitalsForm({ ...pendingVitalsForm });
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div>
      <PatientSubnav patientId={id} />

      <div className="page-header">
        <div>
          <h2 className="page-title">Visit History</h2>
          {patient && (
            <div style={{ marginTop: "0.35rem", color: "var(--gray-500)", fontSize: "0.9rem" }}>
              <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                {patient.name || "Unknown Patient"}
              </span>
              {patient.external_id ? ` - ID ${patient.external_id}` : ""}
            </div>
          )}
        </div>
      </div>

      {actionError && (
        <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
          {actionError}
        </div>
      )}

      {activeVisit && (
        <div className="card" style={{ marginBottom: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "flex-start",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "var(--primary)",
                  marginBottom: "0.35rem",
                }}
              >
                Visit in Progress
              </h3>
              <div style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>
                {formatVisitDate(activeVisit.visit_date || activeVisit.scheduledAt)}
                {activeVisit.clinician?.name
                  ? ` - ${activeVisit.clinician.name}`
                  : ""}
              </div>
              {activeVisit.reason && (
                <div
                  style={{
                    marginTop: "0.35rem",
                    color: "var(--gray-500)",
                    fontSize: "0.9rem",
                  }}
                >
                  Reason: {activeVisit.reason}
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <span className={statusBadgeClass(activeVisit.status)}>
                {activeVisit.status.toLowerCase().replace("_", "-")}
              </span>
              {canDocumentVisit &&
                activeVisit.status.toUpperCase() === "IN_PROGRESS" && (
                  <button onClick={handleCompleteVisit} className="btn btn-primary btn-sm">
                    <CheckCircle2 size={13} /> Complete Visit
                  </button>
                )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
            }}
          >
            <div className="form-panel" style={{ margin: 0 }}>
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--primary)",
                  marginBottom: "0.85rem",
                }}
              >
                Clinical Notes
              </h3>

              {savedNoteEntries.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
                  {savedNoteEntries.map((entry, index) => (
                    <div key={`active-note-${index}`} style={noteEntryCardStyle}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <span style={noteEntryBadgeStyle}>Note Entry {index + 1}</span>
                      </div>
                      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.65 }}>{entry}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "var(--gray-400)", marginBottom: "1rem" }}>
                  No clinical notes have been saved for this visit yet.
                </div>
              )}

              <div style={noteComposerStyle}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ marginBottom: "0.55rem" }}>Add Note Entry</label>
                  <textarea
                    className="form-input"
                    rows={5}
                    placeholder="Document the next clinical note entry."
                    value={newNoteEntry}
                    onChange={(e) => setNewNoteEntry(e.target.value)}
                    style={{ resize: "vertical" }}
                  />
                </div>
              </div>

              <div style={{ marginTop: "0.75rem" }}>
                <button
                  onClick={handleSaveNotes}
                  disabled={notesSaving}
                  className="btn btn-primary"
                >
                  <Save size={14} /> {notesSaving ? "Saving..." : "Save Note Entry"}
                </button>
              </div>
            </div>

            <div className="form-panel" style={{ margin: 0 }}>
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--primary)",
                  marginBottom: "0.75rem",
                }}
              >
                Record Vitals
              </h3>
              <div className="ai-detect-panel">
                <div className="ai-detect-header">
                  <div className="ai-detect-heading">
                    <div className="ai-detect-kicker">AI-assisted</div>
                    <div className="ai-detect-title">Document extraction</div>
                    <div className="ai-detect-copy">
                      Upload a clinical document to extract vitals for review before saving.
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary ai-detect-upload"
                    onClick={handleAiUploadClick}
                  >
                    <Upload size={14} /> Upload Document
                  </button>
                </div>

                <input
                  ref={aiUploadInputRef}
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  onChange={handleAiSourceSelected}
                  style={{ display: "none" }}
                />

                <div className="ai-detect-source">
                  <div className="ai-detect-source-main">
                    <div className="ai-detect-source-label">Selected document</div>
                    <div className="ai-detect-source-name">
                      {aiSourceFile ? aiSourceFile.name : "No document selected"}
                    </div>
                  </div>
                  <span className={`ai-detect-source-status${aiSourceFile ? "" : " is-idle"}`}>
                    {aiLoading
                      ? "Processing..."
                      : aiSourceFile
                        ? "Ready to save"
                        : "Ready to upload"}
                  </span>
                </div>

                {aiLoading && <div className="ai-detect-note">Extracting vitals...</div>}

                {aiWarning && <div className="ai-detect-note">{aiWarning}</div>}

                {aiSourceFile && (
                  <>
                    <div className="ai-detect-note">
                      Review extracted values now. The source document will be attached to this visit when you save vitals.
                    </div>

                    {detectedVitals.length > 0 && (
                      <div className="ai-detect-results">
                        <div className="ai-detect-results-header">
                          <div className="ai-detect-results-title">
                            <CheckCircle2 size={16} /> Detected vitals
                          </div>
                          <div className="ai-detect-results-count">
                            {detectedVitals.length} fields found
                          </div>
                        </div>
                        <div className="ai-detect-tags">
                          {detectedVitals.map((item) => (
                            <span key={item.label} className="ai-detect-tag">
                              {item.label}: {item.value}
                              {item.confidence ? ` (${item.confidence})` : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {(others.length > 0 || aiSourceFile) && (
                      <div className="ai-detect-extra">
                        <div className="ai-detect-extra-label">
                          <FileText size={14} /> Additional observations
                        </div>
                        <textarea
                          className="form-input ai-detect-textarea"
                          rows={3}
                          value={others.join("\n")}
                          placeholder="Other extracted observations"
                          readOnly
                        />
                      </div>
                    )}

                    {hasPendingDetectedValues && (
                      <div className="ai-detect-footer ai-detect-footer-actions">
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={applyDetectedValuesToForm}
                        >
                          Apply detected values to form
                        </button>
                      </div>
                    )}

                    {(isAbnormal.heartRate ||
                      isAbnormal.temperature ||
                      isAbnormal.oxygenSaturation) && (
                      <div style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>
                        {isAbnormal.heartRate && "High heart rate "}
                        {isAbnormal.temperature && "High temperature "}
                        {isAbnormal.oxygenSaturation && "Low oxygen"}
                      </div>
                    )}
                  </>
                )}
              </div>

              <form onSubmit={handleAddVitals} className="form-grid">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className="form-group">
                    <label className="form-label">BP Systolic</label>
                    <input
                      className="form-input"
                      value={vitalsForm.bloodPressureSystolic}
                      onChange={(e) =>
                        setVitalsForm({
                          ...vitalsForm,
                          bloodPressureSystolic: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">BP Diastolic</label>
                    <input
                      className="form-input"
                      value={vitalsForm.bloodPressureDiastolic}
                      onChange={(e) =>
                        setVitalsForm({
                          ...vitalsForm,
                          bloodPressureDiastolic: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className="form-group">
                    <label className="form-label">Heart Rate</label>
                    <input
                      className="form-input"
                      value={vitalsForm.heartRate}
                      onChange={(e) =>
                        setVitalsForm({ ...vitalsForm, heartRate: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Temperature</label>
                    <input
                      className="form-input"
                      value={vitalsForm.temperature}
                      onChange={(e) =>
                        setVitalsForm({ ...vitalsForm, temperature: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div className="form-group">
                    <label className="form-label">Respiratory Rate</label>
                    <input
                      className="form-input"
                      value={vitalsForm.respiratoryRate}
                      onChange={(e) =>
                        setVitalsForm({
                          ...vitalsForm,
                          respiratoryRate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">O2 Saturation</label>
                    <input
                      className="form-input"
                      value={vitalsForm.oxygenSaturation}
                      onChange={(e) =>
                        setVitalsForm({
                          ...vitalsForm,
                          oxygenSaturation: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <button type="submit" disabled={vitalsSubmitting} className="btn btn-primary">
                  {vitalsSubmitting ? "Saving..." : "Save Vitals"}
                </button>
              </form>
            </div>
          </div>

          <div className="form-panel" style={{ margin: "1rem 0 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <div>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "var(--primary)",
                    marginBottom: "0.35rem",
                  }}
                >
                  Visit Documents
                </h3>
                <div style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>
                  Supporting documents saved for this visit appear here.
                </div>
              </div>
              <div style={{ color: "var(--gray-400)", fontSize: "0.85rem" }}>
                {activeVisitDocuments.length} saved
              </div>
            </div>

            {activeVisitDocuments.length > 0 ? (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {activeVisitDocuments.slice(0, 6).map((document) => (
                  (() => {
                    const badgeLabel = getVisitDocumentBadgeLabel(document.type);

                    return (
                      <div
                        key={document.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "0.9rem",
                          alignItems: "center",
                          border: "1px solid var(--gray-200)",
                          borderRadius: "12px",
                          padding: "0.8rem 0.9rem",
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <button
                            type="button"
                            onClick={() => handleOpenVisitDocument(document)}
                            className="btn btn-ghost"
                            style={{ padding: 0, display: "inline-flex", alignItems: "center", gap: "4px", minWidth: 0 }}
                            disabled={openingDocumentId === document.id}
                          >
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {openingDocumentId === document.id ? "Opening..." : document.fileName}
                            </span>
                            <ExternalLink size={12} />
                          </button>
                          <div style={{ color: "var(--gray-400)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                            Added {formatDateTime(document.createdAt)}
                          </div>
                        </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                            {badgeLabel && (
                              <span className="badge" style={{ background: "var(--gray-100)", color: "var(--gray-600)" }}>
                                {badgeLabel}
                              </span>
                            )}
                            <div style={{ color: "var(--gray-500)", fontSize: "0.85rem" }}>
                              {formatFileSize(document.size)}
                            </div>
                            {confirmingDeleteDocumentId === document.id ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteVisitDocument(activeVisit.id, document)}
                                  className="btn btn-ghost"
                                  style={{ color: "#b91c1c", paddingInline: "0.6rem" }}
                                  disabled={deletingDocumentId === document.id}
                                >
                                  <Trash2 size={14} /> {deletingDocumentId === document.id ? "Removing..." : "Confirm"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmingDeleteDocumentId(null)}
                                  className="btn btn-ghost"
                                  style={{ paddingInline: "0.55rem" }}
                                  disabled={deletingDocumentId === document.id}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => requestDeleteVisitDocument(document.id)}
                                className="btn btn-ghost"
                                style={{ color: "#b91c1c", paddingInline: "0.6rem" }}
                                disabled={deletingDocumentId === document.id}
                              >
                                <Trash2 size={14} /> Remove
                              </button>
                            )}
                        </div>
                      </div>
                    );
                  })()
                ))}
              </div>
            ) : (
              <div style={{ color: "var(--gray-400)" }}>
                No documents have been uploaded for this visit yet.
              </div>
            )}
          </div>
        </div>
      )}

      {visits.length === 0 ? (
        <p className="empty-state">No visits recorded</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div
            className="form-panel"
            style={{
              margin: 0,
              background: "linear-gradient(135deg, rgba(37,99,235,0.10), rgba(59,130,246,0.04))",
              border: "1px solid rgba(37,99,235,0.22)",
              boxShadow: "0 12px 32px rgba(37,99,235,0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "var(--primary)",
                    marginBottom: "0.35rem",
                  }}
                >
                  Latest Vitals
                </h3>
                <div style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>
                  {latestVital?.recordedAt
                    ? `Recorded ${formatDateTime(latestVital.recordedAt)}`
                    : "No vitals have been recorded for this patient yet."}
                </div>
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              {latestVitalRows.length > 0 ? (
                <div className="vitals-grid">
                  {latestVitalRows.map((vital) => (
                    <div key={`latest-${vital.label}`}>
                      <div className="vital-item-label" style={{ color: "rgba(30,41,59,0.72)" }}>
                        {vital.label}
                      </div>
                      <div className="vital-item-value" style={{ color: "var(--primary)" }}>
                        {vital.value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "var(--gray-400)" }}>
                  Capture vitals during a visit to see the most recent values here.
                </div>
              )}
            </div>
          </div>

          {visits.map((visit) => {
            const isActive = activeVisit?.id === visit.id;
            const visitVitalRows = buildVitalRows(visit.vitals?.[0]);
            const parsedVisitNotes = parseVisitNotes(visit.notes);
            const visitNoteEntries = splitNoteEntries(parsedVisitNotes.clinicianNotes);
            const hasVisitNotes = visitNoteEntries.length > 0;
            const hasAiObservations = parsedVisitNotes.aiObservations.length > 0;
            const hasVisitVitals = visitVitalRows.length > 0;
            const visitDocuments = visit.documents || [];
            return (
              <div
                key={visit.id}
                className="visit-card"
                style={
                  isActive
                    ? {
                        border: "1px solid var(--accent)",
                        boxShadow: "0 0 0 1px rgba(37,99,235,0.15)",
                      }
                    : undefined
                }
              >
                <div
                  className="visit-card-header"
                  onClick={() =>
                    setExpandedVisit(expandedVisit === visit.id ? null : visit.id)
                  }
                >
                  <div>
                    <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                      {formatVisitDate(visit.visit_date || visit.scheduledAt)}
                    </div>
                    {visit.clinician?.name && (
                      <div style={{ color: "var(--gray-400)", fontSize: "0.8rem" }}>
                        {visit.clinician.name}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {canStartVisit && visit.status.toUpperCase() === "CHECKED_IN" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleStartVisit(visit.id, id);
                        }}
                        className="btn btn-sm btn-primary"
                      >
                        <Play size={12} /> Start
                      </button>
                    )}
                    {visit.status.toUpperCase() === "IN_PROGRESS" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/patients/${id}/visits?activeVisit=${visit.id}`);
                        }}
                        className="btn btn-sm btn-ghost"
                      >
                        Resume Visit
                      </button>
                    )}
                    <span className={statusBadgeClass(visit.status)}>
                      {visit.status.toLowerCase().replace("_", "-")}
                    </span>
                  </div>
                </div>

                {expandedVisit === visit.id && (
                  <div className="visit-card-body">
                    <div>
                      <div style={sectionLabelStyle}>Clinical Notes</div>
                      {hasVisitNotes ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          {visitNoteEntries.map((entry, index) => (
                            <div key={`${visit.id}-note-${index}`} style={noteEntryCardStyle}>
                              <div style={{ marginBottom: "0.5rem" }}>
                                <span style={noteEntryBadgeStyle}>Note Entry {index + 1}</span>
                              </div>
                              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.65 }}>{entry}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: "var(--gray-400)" }}>No notes recorded.</div>
                      )}
                    </div>

                    {hasAiObservations && (
                      <div style={{ marginTop: "0.9rem" }}>
                        <div style={sectionLabelStyle}>AI Extracted Observations</div>
                        <div style={{ ...noteCardStyle, background: "#f8fafc" }}>
                          <ul style={{ margin: 0, paddingLeft: "1rem", lineHeight: 1.7 }}>
                            {parsedVisitNotes.aiObservations.map((item, index) => (
                              <li key={`${visit.id}-ai-${index}`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: "0.9rem" }}>
                      <div style={sectionLabelStyle}>Visit Vitals</div>
                      {hasVisitVitals ? (
                        <div className="vitals-grid">
                          {visitVitalRows.map((vital) => (
                            <div key={`${visit.id}-${vital.label}`}>
                              <div className="vital-item-label">{vital.label}</div>
                              <div className="vital-item-value">{vital.value}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: "var(--gray-400)" }}>
                          No vitals recorded for this visit.
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: "0.9rem" }}>
                      <div style={sectionLabelStyle}>Visit Documents</div>
                      {visitDocuments.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                          {visitDocuments.map((document) => (
                            (() => {
                              const badgeLabel = getVisitDocumentBadgeLabel(document.type);

                              return (
                                <div
                                  key={`${visit.id}-document-${document.id}`}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "0.9rem",
                                    alignItems: "center",
                                    border: "1px solid var(--gray-200)",
                                    borderRadius: "12px",
                                    padding: "0.8rem 0.9rem",
                                  }}
                                >
                                  <div style={{ minWidth: 0, flex: 1 }}>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenVisitDocument(document)}
                                      className="btn btn-ghost"
                                      style={{ padding: 0, display: "inline-flex", alignItems: "center", gap: "4px", minWidth: 0 }}
                                      disabled={openingDocumentId === document.id}
                                    >
                                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {openingDocumentId === document.id ? "Opening..." : document.fileName}
                                      </span>
                                      <ExternalLink size={12} />
                                    </button>
                                    <div style={{ color: "var(--gray-400)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                                      Added {formatDateTime(document.createdAt)}
                                    </div>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                                    {badgeLabel && (
                                      <span className="badge" style={{ background: "var(--gray-100)", color: "var(--gray-600)" }}>
                                        {badgeLabel}
                                      </span>
                                    )}
                                    <div style={{ color: "var(--gray-500)", fontSize: "0.85rem" }}>
                                      {formatFileSize(document.size)}
                                    </div>
                                    {confirmingDeleteDocumentId === document.id ? (
                                      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteVisitDocument(visit.id, document)}
                                          className="btn btn-ghost"
                                          style={{ color: "#b91c1c", paddingInline: "0.6rem" }}
                                          disabled={deletingDocumentId === document.id}
                                        >
                                          <Trash2 size={14} /> {deletingDocumentId === document.id ? "Removing..." : "Confirm"}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setConfirmingDeleteDocumentId(null)}
                                          className="btn btn-ghost"
                                          style={{ paddingInline: "0.55rem" }}
                                          disabled={deletingDocumentId === document.id}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => requestDeleteVisitDocument(document.id)}
                                        className="btn btn-ghost"
                                        style={{ color: "#b91c1c", paddingInline: "0.6rem" }}
                                        disabled={deletingDocumentId === document.id}
                                      >
                                        <Trash2 size={14} /> Remove
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })()
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: "var(--gray-400)" }}>
                          No documents were uploaded for this visit.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

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
