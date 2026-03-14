"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";

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

        // Map the most recent vital record into display rows
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
            rows.push({ label: "Temperature", value: `${latest.temperature} °C` });
          }
          if (latest.respiratoryRate != null) {
            rows.push({ label: "Respiratory Rate", value: `${latest.respiratoryRate} /min` });
          }
          if (latest.oxygenSaturation != null) {
            rows.push({ label: "O₂ Saturation", value: `${latest.oxygenSaturation}%` });
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

  const statusPillStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "scheduled")
      return { background: "#fef3c7", color: "#b45309" };
    if (s === "checked_in" || s === "checked-in")
      return { background: "#e0f2fe", color: "#0369a1" };
    if (s === "in-progress" || s === "in_progress")
      return { background: "#dbeafe", color: "#1e40af" };
    if (s === "completed")
      return { background: "#d1fae5", color: "#065f46" };
    if (s === "cancelled")
      return { background: "#fef2f2", color: "#dc2626" };
    return { background: "#f3f4f6", color: "#374151" };
  };

  const handleStartVisit = async (visitId: string) => {
    try {
      await api.patch(`/encounters/${visitId}/start`);
      window.location.reload();
    } catch (err) {
      console.error("Error starting visit:", err);
      alert("Failed to start visit.");
    }
  };

  if (loading) return <p style={{ color: "#777" }}>Loading...</p>;

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
        <h2 style={{ margin: 0 }}>Visit History</h2>
      </div>

      {/* Vitals Summary */}
      {vitals.length > 0 && (
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ margin: "0 0 1rem 0", color: "#0b2b4a", fontSize: "1.1rem" }}>
            Latest Vitals
          </h3>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {vitals.map((v, i) => (
              <div key={i}>
                <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>{v.label}</div>
                <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                  {v.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {visits.length === 0 ? (
        <p style={{ color: "#777" }}>No visits recorded</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {visits.map((visit) => (
            <div
              key={visit.id}
              style={{
                background: "white",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              <div
                onClick={() =>
                  setExpandedVisit(expandedVisit === visit.id ? null : visit.id)
                }
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem 1.5rem",
                  cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>
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
                    <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                      {visit.clinician.name}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {canStartVisit &&
                    visit.status.toUpperCase() === "CHECKED_IN" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartVisit(visit.id);
                        }}
                        style={{
                          padding: "4px 10px",
                          background: "#2563eb",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                        }}
                      >
                        Start
                      </button>
                    )}
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      ...statusPillStyle(visit.status),
                    }}
                  >
                    {visit.status.toLowerCase().replace("_", "-")}
                  </span>
                </div>
              </div>

              {expandedVisit === visit.id && visit.notes && (
                <div
                  style={{
                    padding: "0 1.5rem 1rem",
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "1rem",
                    color: "#555",
                    fontSize: "0.9rem",
                  }}
                >
                  {visit.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
