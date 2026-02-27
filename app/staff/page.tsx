"use client";

import Link from "next/link";

type Appointment = {
  id: number;
  patient: string;
  time: string;
  status: "Scheduled" | "Completed";
};

export default function StaffDashboard() {
  const todayAppointments: Appointment[] = [
    { id: 1, patient: "Sara Haddad", time: "09:00 AM", status: "Scheduled" },
    { id: 2, patient: "Ali Mansour", time: "11:30 AM", status: "Completed" },
  ];

  const totalAppointmentsToday = todayAppointments.length;
  const completedToday = todayAppointments.filter(
    (a) => a.status === "Completed"
  ).length;

  return (
    <div style={{ padding: "2rem 0" }}>
      {/* HERO SECTION */}
      <div
        style={{
          backgroundColor: "#0F2A4F",
          color: "white",
          padding: "2rem",
          borderRadius: "12px",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ marginBottom: "0.5rem" }}>Staff Dashboard</h1>
        <p style={{ opacity: 0.9 }}>Today’s Appointments Overview</p>
      </div>

      {/* STATS CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        <div style={cardStyle}>
          <h2>{totalAppointmentsToday}</h2>
          <p>Today's Appointments</p>
        </div>

        <div style={cardStyle}>
          <h2>{completedToday}</h2>
          <p>Completed Today</p>
        </div>

        
      </div>

      {/* TODAY'S SCHEDULE TABLE */}
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>Today’s Schedule</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th align="left">Time</th>
              <th align="left">Patient</th>
              <th align="left">Status</th>
            </tr>
          </thead>
          <tbody>
            {todayAppointments.map((appointment) => (
              <tr key={appointment.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{appointment.time}</td>
                <td>{appointment.patient}</td>
                <td
                  style={{
                    color:
                      appointment.status === "Completed"
                        ? "green"
                        : "#E53935",
                  }}
                >
                  {appointment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  borderRadius: "12px",
  padding: "1.5rem",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};