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
};

type Appointment = {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  reason: string;
  status: "scheduled" | "in-progress" | "completed";
};

type UserRecord = {
  id: string;
  role: string;
};

export default function DashboardPage() {
  const { user, isAdmin, isClinician, isStaff } = useAuth();
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
  const [hoveredAptId, setHoveredAptId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await api.get<EncounterApiRecord[]>(
          `/encounters?status=SCHEDULED&date=${today}`
        );
        const data = res.data || [];
        setAppointments(
          data.map((enc) => ({
            id: enc.id,
            patientName: enc.patient?.name || "Unknown",
            patientId: enc.patient?.id || enc.patient_id || "",
            time: new Date(
              enc.visit_date || enc.scheduledAt || Date.now()
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            reason: "Visit",
            status: enc.status.toLowerCase() as Appointment["status"],
          }))
        );
      } catch (err) {
        console.error("Failed to load appointments", err);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchUsers = async () => {
      try {
        const res = await api.get<UserRecord[]>("/api/users");
        const counts: Record<string, number> = {};
        (res.data || []).forEach((u) => {
          counts[u.role] = (counts[u.role] || 0) + 1;
        });
        setUserCounts(counts);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, [isAdmin]);

  const displayName = isClinician
    ? `Dr. ${(user?.name || "Doctor").replace(/^Dr\.\s*/i, "")}`
    : user?.name || user?.email || "User";

  const statusPillStyle = (status: Appointment["status"]) => {
    if (status === "scheduled")
      return { background: "#fef3c7", color: "#b45309", border: "1px solid #f59e0b33" };
    if (status === "in-progress")
      return { background: "#dbeafe", color: "#1e40af", border: "1px solid #3b82f633" };
    return { background: "#d1fae5", color: "#065f46", border: "1px solid #10b98133" };
  };

  const statusAccentColor = (status: Appointment["status"]) => {
    if (status === "scheduled") return "#f59e0b";
    if (status === "in-progress") return "#3b82f6";
    return "#10b981";
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0b2b4a 0%, #1a4b76 50%, #2563eb 100%)",
          color: "white",
          padding: "2rem",
          borderRadius: "16px",
          marginBottom: "2rem",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Welcome back, {displayName}
        </h1>
        <p style={{ opacity: 0.9 }}>{todayDate}</p>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isAdmin ? "1fr 1fr 1fr 1fr" : "1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              background: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
            }}
          >
            📅
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#0b2b4a" }}>
              {appointments.length}
            </div>
            <div style={{ color: "#6b7280" }}>Today&apos;s appointments</div>
          </div>
        </div>

        {isAdmin &&
          ["CLINICIAN", "STAFF", "ADMIN"].map((role) => (
            <div
              key={role}
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "#0b2b4a" }}>
                  {userCounts[role] || 0}
                </div>
                <div style={{ color: "#6b7280" }}>
                  {role.charAt(0) + role.slice(1).toLowerCase()}s
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Quick Actions for STAFF */}
      {(isStaff || isAdmin) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <Link
            href="/patients/new"
            style={{
              padding: "1rem",
              background: "white",
              borderRadius: "10px",
              textDecoration: "none",
              color: "#0b2b4a",
              textAlign: "center",
              border: "1px solid #e5e7eb",
              fontWeight: 500,
            }}
          >
            + Add Patient
          </Link>
          <Link
            href="/appointments"
            style={{
              padding: "1rem",
              background: "white",
              borderRadius: "10px",
              textDecoration: "none",
              color: "#0b2b4a",
              textAlign: "center",
              border: "1px solid #e5e7eb",
              fontWeight: 500,
            }}
          >
            Schedule Appointment
          </Link>
          <Link
            href="/patients"
            style={{
              padding: "1rem",
              background: "white",
              borderRadius: "10px",
              textDecoration: "none",
              color: "#0b2b4a",
              textAlign: "center",
              border: "1px solid #e5e7eb",
              fontWeight: 500,
            }}
          >
            View Patients
          </Link>
        </div>
      )}

      {/* Today's Schedule */}
      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", color: "#0b2b4a" }}>
            Today&apos;s Schedule
          </h2>
          <Link href="/appointments" style={{ color: "#0b2b4a" }}>
            View full schedule
          </Link>
        </div>
        {appointments.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No appointments today</p>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.id}
              onMouseEnter={() => setHoveredAptId(apt.id)}
              onMouseLeave={() => setHoveredAptId(null)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                borderBottom: "1px solid #e5e7eb",
                background: hoveredAptId === apt.id ? "#f9fafb" : "white",
              }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <div
                  style={{
                    width: "4px",
                    height: "50px",
                    background: statusAccentColor(apt.status),
                  }}
                />
                <div>
                  <strong>{apt.time}</strong>{" "}
                  <Link href={`/patients/${apt.patientId}`}>
                    {apt.patientName}
                  </Link>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                    {apt.reason}
                  </div>
                </div>
              </div>
              <span
                style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  ...statusPillStyle(apt.status),
                }}
              >
                {apt.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
