"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import { Plus, X } from "lucide-react";

type EncounterApiRecord = {
  id: string;
  patient?: { id?: string; name?: string };
  patient_id?: string;
  visit_date?: string;
  scheduledAt?: string;
  status: string;
  clinician?: { name?: string };
};

type FilterTab = "ALL" | "SCHEDULED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED";

const statusBadgeClass = (status: string) => {
  const s = status.toLowerCase().replace("_", "-");
  if (s === "scheduled") return "badge badge-scheduled";
  if (s === "checked-in") return "badge badge-checked-in";
  if (s === "in-progress") return "badge badge-in-progress";
  if (s === "completed") return "badge badge-completed";
  if (s === "cancelled") return "badge badge-cancelled";
  return "badge";
};

export default function AppointmentsPage() {
  const { isAdmin, isClinician, isStaff } = useAuth();
  const [encounters, setEncounters] = useState<EncounterApiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("ALL");

  const [showForm, setShowForm] = useState(false);
  const [schedForm, setSchedForm] = useState({
    patientId: "",
    visitDate: "",
    clinicianUserId: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const canSchedule = isAdmin || isStaff;
  const canManage = isAdmin || isClinician;

  const fetchEncounters = async () => {
    try {
      const res = await api.get<EncounterApiRecord[]>("/encounters");
      setEncounters(res.data || []);
    } catch (err) {
      console.error("Error fetching encounters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncounters();
  }, []);

  const filtered =
    filter === "ALL"
      ? encounters
      : encounters.filter((e) => e.status.toUpperCase().replace("-", "_") === filter);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/encounters", {
        patientId: schedForm.patientId,
        visitDate: schedForm.visitDate,
        clinicianUserId: schedForm.clinicianUserId,
        reason: schedForm.reason || undefined,
      });
      setShowForm(false);
      setSchedForm({ patientId: "", visitDate: "", clinicianUserId: "", reason: "" });
      fetchEncounters();
    } catch (err) {
      console.error("Error scheduling:", err);
      alert("Failed to schedule appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (encounterId: string, status: string) => {
    try {
      await api.patch(`/encounters/${encounterId}/status`, { status });
      fetchEncounters();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update appointment.");
    }
  };

  const tabs: { label: string; value: FilterTab }[] = [
    { label: "All", value: "ALL" },
    { label: "Scheduled", value: "SCHEDULED" },
    { label: "Checked In", value: "CHECKED_IN" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Completed", value: "COMPLETED" },
  ];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Appointments</h2>
        {canSchedule && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`btn ${showForm ? "btn-ghost" : "btn-primary"}`}
          >
            {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Schedule</>}
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-panel" style={{ maxWidth: "500px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary)", marginBottom: "1rem" }}>
            Schedule Appointment
          </h3>
          <form onSubmit={handleSchedule} className="form-grid">
            <div className="form-group">
              <label className="form-label">Patient ID</label>
              <input
                className="form-input"
                value={schedForm.patientId}
                onChange={(e) => setSchedForm({ ...schedForm, patientId: e.target.value })}
                placeholder="Enter patient ID"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Visit Date & Time</label>
              <input
                className="form-input"
                type="datetime-local"
                value={schedForm.visitDate}
                onChange={(e) => setSchedForm({ ...schedForm, visitDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Clinician User ID</label>
              <input
                className="form-input"
                value={schedForm.clinicianUserId}
                onChange={(e) => setSchedForm({ ...schedForm, clinicianUserId: e.target.value })}
                placeholder="Enter clinician user ID"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Reason (optional)</label>
              <input
                className="form-input"
                value={schedForm.reason}
                onChange={(e) => setSchedForm({ ...schedForm, reason: e.target.value })}
                placeholder="e.g. Follow-up"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg">
              {submitting ? "Scheduling..." : "Schedule"}
            </button>
          </form>
        </div>
      )}

      <div className="filter-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`filter-tab${filter === tab.value ? " active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">No appointments found</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Clinician</th>
                <th>Status</th>
                <th style={{ width: "1%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enc) => {
                const s = enc.status.toUpperCase().replace("-", "_");
                return (
                  <tr key={enc.id}>
                    <td>
                      <Link
                        href={`/patients/${enc.patient?.id || enc.patient_id}`}
                        style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
                      >
                        {enc.patient?.name || enc.patient_id || "---"}
                      </Link>
                    </td>
                    <td>
                      {new Date(
                        enc.visit_date || enc.scheduledAt || Date.now()
                      ).toLocaleString()}
                    </td>
                    <td>{enc.clinician?.name || "---"}</td>
                    <td>
                      <span className={statusBadgeClass(enc.status)}>
                        {enc.status.toLowerCase().replace("_", "-")}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "4px", whiteSpace: "nowrap" }}>
                        {canSchedule && s === "SCHEDULED" && (
                          <>
                            <button onClick={() => updateStatus(enc.id, "CHECKED_IN")} className="btn btn-sm btn-secondary">
                              Check In
                            </button>
                            <button onClick={() => updateStatus(enc.id, "CANCELLED")} className="btn btn-sm btn-danger">
                              Cancel
                            </button>
                          </>
                        )}
                        {canManage && s === "CHECKED_IN" && (
                          <button onClick={() => updateStatus(enc.id, "IN_PROGRESS")} className="btn btn-sm btn-primary">
                            Start
                          </button>
                        )}
                        {canManage && s === "IN_PROGRESS" && (
                          <button onClick={() => updateStatus(enc.id, "COMPLETED")} className="btn btn-sm btn-primary">
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
