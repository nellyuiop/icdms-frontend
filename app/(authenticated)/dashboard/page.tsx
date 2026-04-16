"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  CalendarDays,
  UserCheck,
  Stethoscope,
  ShieldCheck,
  UserPlus,
  Calendar,
  Users,
  ArrowRight,
  Play,
} from "lucide-react";

type EncounterApiRecord = {
  id: string;
  patient?: { id?: string; name?: string };
  patient_id?: string;
  visit_date?: string;
  scheduledAt?: string;
  status: string;
};

type Appointment = {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  reason: string;
  status: "scheduled" | "checked-in" | "in-progress" | "completed";
};

type UserRecord = {
  id: string;
  role: string;
};

const isSameLocalDay = (value?: string) => {
  if (!value) return false;
  const target = new Date(value);
  const now = new Date();

  return (
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate()
  );
};

const statusAccentColor = (status: Appointment["status"]) => {
  if (status === "scheduled") return "#f59e0b";
  if (status === "checked-in") return "#0ea5e9";
  if (status === "in-progress") return "#3b82f6";
  return "#10b981";
};

const statusBadgeClass = (status: Appointment["status"]) => {
  if (status === "scheduled") return "badge badge-scheduled";
  if (status === "checked-in") return "badge badge-checked-in";
  if (status === "in-progress") return "badge badge-in-progress";
  return "badge badge-completed";
};

export default function DashboardPage() {
  const { user, isAdmin, isClinician, isStaff } = useAuth();
  const router = useRouter();
  const [todayDate] = useState(() =>
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [userCounts, setUserCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let isCancelled = false;

    const loadAppointments = async () => {
      try {
        const query = `/encounters`;
        const res = await api.get<EncounterApiRecord[]>(query);
        const data = res.data || [];
        const visibleAppointments = data.filter((enc) => {
          if (!isSameLocalDay(enc.visit_date || enc.scheduledAt)) {
            return false;
          }

          const normalizedStatus = enc.status.toUpperCase();

          if (isClinician) {
            return ["CHECKED_IN", "IN_PROGRESS", "SCHEDULED"].includes(
              normalizedStatus
            );
          }

          return ["CHECKED_IN", "IN_PROGRESS", "SCHEDULED"].includes(
            normalizedStatus
          );
        });

        if (isCancelled) {
          return;
        }

        setAppointments(
          visibleAppointments.map((enc) => ({
            id: enc.id,
            patientName: enc.patient?.name || "Unknown",
            patientId: enc.patient?.id || enc.patient_id || "",
            time: new Date(
              enc.visit_date || enc.scheduledAt || Date.now()
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            reason: "Visit",
            status: enc.status
              .toLowerCase()
              .replace("_", "-") as Appointment["status"],
          }))
        );
      } catch (err) {
        console.error("Failed to load appointments", err);
      }
    };

    void loadAppointments();

    return () => {
      isCancelled = true;
    };
  }, [isClinician]);

  useEffect(() => {
    if (!isAdmin) return;

    let isCancelled = false;

    const fetchUsers = async () => {
      try {
        const res = await api.get<UserRecord[]>("/api/users");
        const counts: Record<string, number> = {};
        (res.data || []).forEach((u) => {
          counts[u.role] = (counts[u.role] || 0) + 1;
        });

        if (!isCancelled) {
          setUserCounts(counts);
        }
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    void fetchUsers();

    return () => {
      isCancelled = true;
    };
  }, [isAdmin]);

  const handleStartVisit = async (visitId: string, patientId: string) => {
    try {
      await api.patch(`/encounters/${visitId}/start`);
      router.push(`/patients/${patientId}/visits?activeVisit=${visitId}`);
    } catch (err) {
      console.error("Failed to start visit", err);
    }
  };

  const displayName = isClinician
    ? `Dr. ${(user?.name || "Doctor").replace(/^Dr\.\s*/i, "")}`
    : user?.name || user?.email || "User";

  const roleStatItems = isAdmin
    ? [
        {
          label: "Clinicians",
          count: userCounts["CLINICIAN"] || 0,
          icon: Stethoscope,
          bg: "#dbeafe",
          color: "#2563eb",
        },
        {
          label: "Staff",
          count: userCounts["STAFF"] || 0,
          icon: UserCheck,
          bg: "#d1fae5",
          color: "#10b981",
        },
        {
          label: "Admins",
          count: userCounts["ADMIN"] || 0,
          icon: ShieldCheck,
          bg: "#fef2f2",
          color: "#dc2626",
        },
      ]
    : [];

  return (
    <div>
      <div className="welcome-banner">
        <h1>Welcome back, {displayName}</h1>
        <p>{todayDate}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dbeafe" }}>
            <CalendarDays size={20} color="#2563eb" />
          </div>
          <div>
            <div className="stat-value">{appointments.length}</div>
            <div className="stat-label">Today&apos;s appointments</div>
          </div>
        </div>

        {roleStatItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="stat-card">
              <div className="stat-icon" style={{ background: item.bg }}>
                <Icon size={20} color={item.color} />
              </div>
              <div>
                <div className="stat-value">{item.count}</div>
                <div className="stat-label">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {(isStaff || isAdmin) && (
        <div className="quick-actions">
          <Link href="/patients" className="quick-action-card">
            <UserPlus size={16} />
            Add Patient
          </Link>
          <Link href="/appointments" className="quick-action-card">
            <Calendar size={16} />
            Schedule Appointment
          </Link>
          <Link href="/patients" className="quick-action-card">
            <Users size={16} />
            View Patients
          </Link>
        </div>
      )}

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 className="page-title" style={{ fontSize: "1.15rem" }}>
            Today&apos;s Schedule
          </h2>
          <Link
            href="/appointments"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {appointments.length === 0 ? (
          <p className="empty-state" style={{ padding: "1.5rem 0" }}>
            No appointments scheduled for today
          </p>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="list-item">
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <div
                  className="list-accent"
                  style={{ background: statusAccentColor(apt.status) }}
                />
                <div>
                  <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--gray-600)", marginRight: "0.5rem" }}>
                      {apt.time}
                    </span>
                    <Link
                      href={`/patients/${apt.patientId}`}
                      style={{ color: "var(--primary)", textDecoration: "none" }}
                    >
                      {apt.patientName}
                    </Link>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>
                    {apt.reason}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {(isClinician || isAdmin) && apt.status === "checked-in" && (
                  <button
                    onClick={() => handleStartVisit(apt.id, apt.patientId)}
                    className="btn btn-sm btn-primary"
                  >
                    <Play size={12} /> Start Visit
                  </button>
                )}
                {(isClinician || isAdmin) && apt.status === "in-progress" && (
                  <button
                    onClick={() =>
                      router.push(`/patients/${apt.patientId}/visits?activeVisit=${apt.id}`)
                    }
                    className="btn btn-sm btn-ghost"
                  >
                    Open Visit
                  </button>
                )}
                <span className={statusBadgeClass(apt.status)}>{apt.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
