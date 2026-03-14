"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import { Plus } from "lucide-react";
import ScheduleVisitModal from "@/components/ScheduleVisitModal";

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
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [error, setError] = useState("");

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

  const updateStatus = async (encounterId: string, status: string) => {
    setError("");
    try {
      await api.patch(`/encounters/${encounterId}/status`, { status });
      fetchEncounters();
    } catch {
      setError("Failed to update appointment.");
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
            onClick={() => setShowScheduleModal(true)}
            className="btn btn-primary"
          >
            <Plus size={15} /> Schedule
          </button>
        )}
      </div>

      <ScheduleVisitModal
        open={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSuccess={() => {
          setShowScheduleModal(false);
          fetchEncounters();
        }}
      />

      {error && <div className="alert alert-error" style={{ marginBottom: "1rem" }}>{error}</div>}

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
