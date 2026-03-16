"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import PatientSubnav from "@/components/PatientSubnav";
import { Play } from "lucide-react";

type EncounterApiRecord = {
  id: string;
  patient?: { id?: string; name?: string };
  patient_id?: string;
  visit_date?: string;
  scheduledAt?: string;
  status: string;
  clinician?: { name?: string };
  notes?: string;
};

type VitalRecord = {
  id: number;
  bloodPressureSystolic?: number | null;
  bloodPressureDiastolic?: number | null;
  heartRate?: number | null;
  temperature?: number | null;
  respiratoryRate?: number | null;
  oxygenSaturation?: number | null;
  recordedAt?: string;
};

type VitalDisplay = {
  label: string;
  value: string;
};

const statusBadgeClass = (status: string) => {
  const s = status.toLowerCase().replace("_", "-");
  if (s === "scheduled") return "badge badge-scheduled";
  if (s === "checked-in") return "badge badge-checked-in";
  if (s === "in-progress") return "badge badge-in-progress";
  if (s === "completed") return "badge badge-completed";
  if (s === "cancelled") return "badge badge-cancelled";
  return "badge";
};

export default function PatientVisitsPage() {
  const { isAdmin, isClinician } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const [visits, setVisits] = useState<EncounterApiRecord[]>([]);
  const [vitals, setVitals] = useState<VitalDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null);

  const canStartVisit = isAdmin || isClinician;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [encountersRes, vitalsRes] = await Promise.all([
          api.get<EncounterApiRecord[]>("/encounters"),
          api.get<VitalRecord[]>(`/patients/${id}/vitals`),
        ]);

        const patientVisits = (encountersRes.data || []).filter(
          (enc) => enc.patient?.id === id || enc.patient_id === id
        );
        setVisits(patientVisits);

        const latest = (vitalsRes.data || [])[0];
        if (latest) {
          const rows: VitalDisplay[] = [];
          if (latest.bloodPressureSystolic != null && latest.bloodPressureDiastolic != null) {
            rows.push({ label: "Blood Pressure", value: `${latest.bloodPressureSystolic}/${latest.bloodPressureDiastolic} mmHg` });
          }
          if (latest.heartRate != null) {
            rows.push({ label: "Heart Rate", value: `${latest.heartRate} bpm` });
          }
          if (latest.temperature != null) {
            rows.push({ label: "Temperature", value: `${latest.temperature} C` });
          }
          if (latest.respiratoryRate != null) {
            rows.push({ label: "Respiratory Rate", value: `${latest.respiratoryRate} /min` });
          }
          if (latest.oxygenSaturation != null) {
            rows.push({ label: "O2 Saturation", value: `${latest.oxygenSaturation}%` });
          }
          setVitals(rows);
        }
      } catch (err) {
        console.error("Error fetching visits:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const [actionError, setActionError] = useState("");

  const handleStartVisit = async (visitId: string) => {
    setActionError("");
    try {
      await api.patch(`/encounters/${visitId}/start`);
      window.location.reload();
    } catch {
      setActionError("Failed to start visit.");
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div>
      <PatientSubnav patientId={id} />

      <div className="page-header">
        <h2 className="page-title">Visit History</h2>
      </div>

      {actionError && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{actionError}</div>}

      {vitals.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.75rem" }}>
            Latest Vitals
          </h3>
          <div className="vitals-grid">
            {vitals.map((v, i) => (
              <div key={i}>
                <div className="vital-item-label">{v.label}</div>
                <div className="vital-item-value">{v.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {visits.length === 0 ? (
        <p className="empty-state">No visits recorded</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {visits.map((visit) => (
            <div key={visit.id} className="visit-card">
              <div
                className="visit-card-header"
                onClick={() => setExpandedVisit(expandedVisit === visit.id ? null : visit.id)}
              >
                <div>
                  <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                    {new Date(
                      visit.visit_date || visit.scheduledAt || Date.now()
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
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
                        handleStartVisit(visit.id);
                      }}
                      className="btn btn-sm btn-primary"
                    >
                      <Play size={12} /> Start
                    </button>
                  )}
                  <span className={statusBadgeClass(visit.status)}>
                    {visit.status.toLowerCase().replace("_", "-")}
                  </span>
                </div>
              </div>

              {expandedVisit === visit.id && visit.notes && (
                <div className="visit-card-body">{visit.notes}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
