"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
};

type FilterTab = "ALL" | "SCHEDULED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED";

export default function AppointmentsPage() {
  const { isAdmin, isClinician, isStaff } = useAuth();
  const [encounters, setEncounters] = useState<EncounterApiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("ALL");

  // Scheduling form
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ margin: 0 }}>Appointments</h2>
        {canSchedule && (
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
            {showForm ? "Cancel" : "+ Schedule Appointment"}
          </button>
        )}
      </div>

      {/* Schedule Form */}
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
          <h3 style={{ marginTop: 0 }}>Schedule New Appointment</h3>
          <form onSubmit={handleSchedule} style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
                Patient ID
              </label>
              <input
                value={schedForm.patientId}
                onChange={(e) =>
                  setSchedForm({ ...schedForm, patientId: e.target.value })
                }
                placeholder="Enter patient ID"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
                Visit Date & Time
              </label>
              <input
                type="datetime-local"
                value={schedForm.visitDate}
                onChange={(e) =>
                  setSchedForm({ ...schedForm, visitDate: e.target.value })
                }
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
                Clinician User ID
              </label>
              <input
                value={schedForm.clinicianUserId}
                onChange={(e) =>
                  setSchedForm({ ...schedForm, clinicianUserId: e.target.value })
                }
                placeholder="Enter clinician user ID"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}>
                Reason (optional)
              </label>
              <input
                value={schedForm.reason}
                onChange={(e) =>
                  setSchedForm({ ...schedForm, reason: e.target.value })
                }
                placeholder="e.g. Follow-up"
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
              {submitting ? "Scheduling..." : "Schedule"}
            </button>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              background: filter === tab.value ? "#0b2b4a" : "white",
              color: filter === tab.value ? "white" : "#374151",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#777" }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "#777" }}>No appointments found</p>
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
              <th style={{ padding: "12px", textAlign: "left" }}>Patient</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Clinician</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "12px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((enc) => {
              const s = enc.status.toUpperCase().replace("-", "_");
              return (
                <tr key={enc.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>
                    <Link
                      href={`/patients/${enc.patient?.id || enc.patient_id}`}
                      style={{ color: "#2563eb" }}
                    >
                      {enc.patient?.name || enc.patient_id || "—"}
                    </Link>
                  </td>
                  <td style={{ padding: "12px" }}>
                    {new Date(
                      enc.visit_date || enc.scheduledAt || Date.now()
                    ).toLocaleString()}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {enc.clinician?.name || "—"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        ...statusPillStyle(enc.status),
                      }}
                    >
                      {enc.status.toLowerCase().replace("_", "-")}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                      {canSchedule && s === "SCHEDULED" && (
                        <>
                          <button
                            onClick={() => updateStatus(enc.id, "CHECKED_IN")}
                            style={actionBtn("#10b981")}
                          >
                            Check In
                          </button>
                          <button
                            onClick={() => updateStatus(enc.id, "CANCELLED")}
                            style={actionBtn("#dc2626")}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {canManage && s === "CHECKED_IN" && (
                        <button
                          onClick={() => updateStatus(enc.id, "IN_PROGRESS")}
                          style={actionBtn("#2563eb")}
                        >
                          Start
                        </button>
                      )}
                      {canManage && s === "IN_PROGRESS" && (
                        <button
                          onClick={() => updateStatus(enc.id, "COMPLETED")}
                          style={actionBtn("#2563eb")}
                        >
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

const actionBtn = (bg: string) => ({
  padding: "4px 10px",
  background: bg,
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.8rem",
  fontWeight: 500 as const,
});
