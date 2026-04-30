"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import PageBackLink from "@/components/PageBackLink";
import ConfirmModal from "@/components/ConfirmModal";
import { Play, Plus } from "lucide-react";
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

type FilterTab =
  | "ALL"
  | "SCHEDULED"
  | "CHECKED_IN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";


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
  const router = useRouter();
  const [encounters, setEncounters] = useState<EncounterApiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("ALL");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<EncounterApiRecord | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState("");

  const canSchedule = isAdmin || isStaff;
  const canManage = isAdmin || isClinician;

  const fetchEncounters = async () => {
    setError("");
    try {
      const res = await api.get<EncounterApiRecord[]>("/encounters");
      setEncounters(res.data || []);
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;

      if (status !== 500) {
        console.error("Error fetching encounters:", err);
      }

      setError(
        status === 500
          ? "Failed to load appointments. Refresh the page after the backend restarts."
          : "Failed to load appointments."
      );
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

  const startVisit = async (encounterId: string, patientId: string) => {
    setError("");
    try {
      await api.patch(`/encounters/${encounterId}/start`);
      router.push(`/patients/${patientId}/visits?activeVisit=${encounterId}`);
    } catch {
      setError("Failed to start appointment.");
    }
  };

  const tabs: { label: string; value: FilterTab }[] = [
    { label: "All", value: "ALL" },
    { label: "Scheduled", value: "SCHEDULED" },
    { label: "Checked In", value: "CHECKED_IN" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const confirmCancel = async () => {
    if (!cancelTarget) return;

    setCancelLoading(true);
    try {
      await updateStatus(cancelTarget.id, "CANCELLED");
      setCancelTarget(null);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div>
      <PageBackLink />

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

      <ConfirmModal
        open={!!cancelTarget}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel ${
          cancelTarget?.patient?.name || "this appointment"
        }?`}
        confirmLabel="Cancel Appointment"
        confirmVariant="danger"
        loading={cancelLoading}
        onCancel={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
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
                const patientId = enc.patient?.id || enc.patient_id || "";
                return (
                  <tr key={enc.id}>
                    <td>
                      <Link
                        href={`/patients/${patientId}`}
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
                            <button
                              onClick={() => setCancelTarget(enc)}
                              className="btn btn-sm btn-danger"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {canManage && s === "CHECKED_IN" && (
                          <button onClick={() => startVisit(enc.id, patientId)} className="btn btn-sm btn-primary">
                            <Play size={12} /> Start
                          </button>
                        )}
                        {canManage && s === "IN_PROGRESS" && (
                          <button onClick={() => router.push(`/patients/${patientId}/visits?activeVisit=${enc.id}`)} className="btn btn-sm btn-ghost">
                            Open Visit
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
