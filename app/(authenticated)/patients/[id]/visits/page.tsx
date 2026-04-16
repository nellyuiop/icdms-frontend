"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import PatientSubnav from "@/components/PatientSubnav";
import {
  FileText,
  Play,
  Save,
  CheckCircle2,
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
};

type VitalRecord = {
  id: number;
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

const emptyVitalsForm = (): VitalsFormState => ({
  bloodPressureSystolic: "",
  bloodPressureDiastolic: "",
  heartRate: "",
  temperature: "",
  respiratoryRate: "",
  oxygenSaturation: "",
});

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

const AI_OBSERVATIONS_HEADING = "AI Extracted Observations:";

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
  const [loading, setLoading] = useState(true);
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [activeVisitNotes, setActiveVisitNotes] = useState("");
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

  const canStartVisit = isAdmin || isClinician;
  const canDocumentVisit = isAdmin || isClinician;

  const fetchData = useCallback(async () => {
    try {
      const [patientRes, encountersRes] = await Promise.all([
        api.get<PatientSummary>(`/patients/${id}`),
        api.get<EncounterApiRecord[]>("/encounters"),
      ]);

      setPatient(patientRes.data);

      const patientVisits = (encountersRes.data || []).filter(
        (enc) => enc.patient?.id === id || enc.patient_id === id
      );
      setVisits(patientVisits);
    } catch (err) {
      console.error("Error fetching visits:", err);
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
  const isAbnormal = {
    heartRate: Number(vitalsForm.heartRate) > 100,
    temperature: Number(vitalsForm.temperature) > 38,
    oxygenSaturation: Number(vitalsForm.oxygenSaturation) < 95,
  };

  useEffect(() => {
    const parsedNotes = parseVisitNotes(activeVisit?.notes);
    setActiveVisitNotes(parsedNotes.clinicianNotes);
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
    try {
      await api.patch(`/encounters/${activeVisit.id}/status`, {
        status: activeVisit.status,
        notes: mergeVisitNotesWithObservations(activeVisitNotes, savedAiObservations),
      });
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
    const mergedNotes = mergeVisitNotesWithObservations(
      activeVisitNotes,
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
      if (mergedNotes !== activeVisitNotes.trim()) {
        await api.patch(`/encounters/${activeVisit.id}/status`, {
          status: activeVisit.status,
          notes: mergedNotes,
        });
        setSavedAiObservations(observationsToPersist);
      }

      await api.post(`/encounters/${activeVisit.id}/vitals`, payload);
      setVitalsForm(emptyVitalsForm());
      await fetchData();
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
                Active Visit Workspace
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
                  marginBottom: "0.75rem",
                }}
              >
                Visit Notes
              </h3>
              <textarea
                className="form-input"
                rows={8}
                placeholder="Document encounter-specific notes here..."
                value={activeVisitNotes}
                onChange={(e) => setActiveVisitNotes(e.target.value)}
                style={{ resize: "vertical" }}
              />
              <div style={{ marginTop: "0.75rem" }}>
                <button
                  onClick={handleSaveNotes}
                  disabled={notesSaving}
                  className="btn btn-primary"
                >
                  <Save size={14} /> {notesSaving ? "Saving..." : "Save Notes"}
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
                        ? "Ready for review"
                        : "Ready to upload"}
                  </span>
                </div>

                {aiLoading && <div className="ai-detect-note">Extracting vitals...</div>}

                {aiWarning && <div className="ai-detect-note">{aiWarning}</div>}

                {aiSourceFile && (
                  <>
                    <div className="ai-detect-note">
                      Review extracted values before saving them to the visit.
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
        </div>
      )}

      {visits.length === 0 ? (
        <p className="empty-state">No visits recorded</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {visits.map((visit) => {
            const isActive = activeVisit?.id === visit.id;
            const visitVitalRows = buildVitalRows(visit.vitals?.[0]);
            const parsedVisitNotes = parseVisitNotes(visit.notes);
            const hasVisitNotes = Boolean(parsedVisitNotes.clinicianNotes);
            const hasAiObservations = parsedVisitNotes.aiObservations.length > 0;
            const hasVisitVitals = visitVitalRows.length > 0;
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
                        Open Workspace
                      </button>
                    )}
                    <span className={statusBadgeClass(visit.status)}>
                      {visit.status.toLowerCase().replace("_", "-")}
                    </span>
                  </div>
                </div>

                {expandedVisit === visit.id && (
                  <div className="visit-card-body">
                    {hasVisitNotes ? (
                      <div style={{ whiteSpace: "pre-wrap" }}>
                        {parsedVisitNotes.clinicianNotes}
                      </div>
                    ) : (
                      <div style={{ color: "var(--gray-400)" }}>No notes recorded.</div>
                    )}

                    {hasAiObservations && (
                      <div style={{ marginTop: "0.9rem" }}>
                        <div
                          style={{
                            color: "var(--gray-500)",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            marginBottom: "0.5rem",
                          }}
                        >
                          AI Extracted Observations
                        </div>
                        <div style={{ whiteSpace: "pre-wrap" }}>
                          {parsedVisitNotes.aiObservations.map((item) => `- ${item}`).join("\n")}
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: "0.9rem" }}>
                      <div
                        style={{
                          color: "var(--gray-500)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Visit Vitals
                      </div>
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
