"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/app/lib/api";
import { getStoredUser } from "@/app/lib/auth";

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  reason: string;
  status: "scheduled" | "in-progress" | "completed";
}

type EncounterApiRecord = {
  id: string;
  patient?: {
    id?: string;
    name?: string;
  };
  patient_id?: string;
  visit_date?: string;
  scheduledAt?: string;
  status: string;
};

export default function DoctorDashboard() {
  const [doctorName] = useState(() => {
    const user = getStoredUser();
    if (!user?.name) return "Doctor";

    return user.name.replace(/^Dr\.\s*/i, "");
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hoveredAptId, setHoveredAptId] = useState<string | null>(null);
  const [isStatsHover, setIsStatsHover] = useState(false);

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get<EncounterApiRecord[]>("/encounters?status=SCHEDULED");
        const data = res.data || [];

        const mapped = data.map((enc) => ({
          id: enc.id,
          patientName: enc.patient?.name || "Unknown",
          patientId: enc.patient?.id || enc.patient_id || "",
          time: new Date(enc.visit_date || enc.scheduledAt || Date.now()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          reason: "Visit",
          status: enc.status.toLowerCase() as Appointment["status"],
        }));

        setAppointments(mapped);
      } catch (err) {
        console.error("Failed to load appointments", err);
      }
    };

    fetchAppointments();
  }, []);

  const stats = [
    {
      label: "Today appointments",
      value: appointments.length.toString(),
    },
  ];

  const statusPillStyle = (status: Appointment["status"]) => {
    if (status === "scheduled") {
      return {
        background: "#fef3c7",
        color: "#b45309",
        border: "1px solid #f59e0b33",
      };
    }

    if (status === "in-progress") {
      return {
        background: "#dbeafe",
        color: "#1e40af",
        border: "1px solid #3b82f633",
      };
    }

    return {
      background: "#d1fae5",
      color: "#065f46",
      border: "1px solid #10b98133",
    };
  };

  const statusAccentColor = (status: Appointment["status"]) => {
    if (status === "scheduled") return "#f59e0b";
    if (status === "in-progress") return "#3b82f6";
    return "#10b981";
  };

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
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
          Welcome back, Dr. {doctorName}
        </h1>
        <p style={{ opacity: 0.9 }}>{todayDate}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            onMouseEnter={() => setIsStatsHover(true)}
            onMouseLeave={() => setIsStatsHover(false)}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              transition: "transform 0.2s ease",
              transform: isStatsHover ? "translateY(-3px)" : "translateY(0)",
            }}
          >
            <svg width="40" height="40" fill="#0b2b4a" viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V9h14v11z" />
            </svg>

            <div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#0b2b4a",
                }}
              >
                {stat.value}
              </div>
              <div style={{ color: "#6b7280" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          border: "1px solid #e5e7eb",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", color: "#0b2b4a" }}>Today schedule</h2>

          <Link href="/appointments" style={{ color: "#0b2b4a" }}>
            View full schedule
          </Link>
        </div>
        {appointments.length === 0 ? (
          <p>No appointments today</p>
        ) : (
          appointments.map((apt) => {
            const isHover = hoveredAptId === apt.id;

            return (
              <div
                key={apt.id}
                onMouseEnter={() => setHoveredAptId(apt.id)}
                onMouseLeave={() => setHoveredAptId(null)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                  background: isHover ? "#f9fafb" : "white",
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
                    <Link href={`/patients/${apt.patientId}`}>{apt.patientName}</Link>

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
            );
          })
        )}
      </div>

      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ fontSize: "1.3rem", color: "#0b2b4a" }}>Recent Patients</h2>

        <table style={{ width: "100%", marginTop: "1rem" }}>
          <tbody>
            <tr>
              <td>P-1001</td>
              <td>John Smith</td>
              <td>2026-02-10</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
