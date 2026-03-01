// app/admin/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [date] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  );

  // Mock data - users
  const users = [
    { role: "Clinicians", count: 8, active: 7 },
    { role: "Staff", count: 12, active: 10 },
    { role: "Admins", count: 2, active: 2 },
  ];

  // Recent activities (audit log)
  const recentActivities = [
    {
      user: "Dr. Rami Haddad",
      action: "Viewed patient P-1001",
      time: "2 min ago",
      role: "Clinician",
    },
    {
      user: "Maya (Staff)",
      action: "Registered new patient",
      time: "15 min ago",
      role: "Staff",
    },
    {
      user: "Admin",
      action: "Added new user",
      time: "1 hour ago",
      role: "Admin",
    },
    {
      user: "Dr. Sarah",
      action: "Updated lab report",
      time: "3 hours ago",
      role: "Clinician",
    },
    {
      user: "Staff",
      action: "Uploaded document",
      time: "5 hours ago",
      role: "Staff",
    },
  ];

  // System stats
  const systemStats = [
    { label: "Total Users", value: "22", icon: "👥", change: "+2 this month" },
    {
      label: "Total Patients",
      value: "1,247",
      icon: "🏥",
      change: "+48 this month",
    },
    {
      label: "Today's Visits",
      value: "28",
      icon: "📅",
      change: "12 completed",
    },
    {
      label: "Storage Used",
      value: "64%",
      icon: "💾",
      change: "2.4 GB / 3.7 GB",
    },
  ];

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0b2b4a, #1a4b76)",
          color: "white",
          padding: "2rem",
          borderRadius: "16px",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Admin Dashboard
        </h1>
        <p style={{ opacity: 0.9 }}>{date} · System Oversight & Management</p>
      </div>

      {/* System Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {systemStats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              {stat.icon}
            </div>
            <div
              style={{ fontSize: "2rem", fontWeight: "600", color: "#0b2b4a" }}
            >
              {stat.value}
            </div>
            <div
              style={{
                color: "#6b7280",
                fontSize: "0.9rem",
                marginBottom: "0.25rem",
              }}
            >
              {stat.label}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#059669" }}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* User Management */}
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
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.3rem", color: "#0b2b4a" }}>
              User Management
            </h2>
            <Link
              href="/admin/users"
              style={{
                color: "#0b2b4a",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              Manage Users →
            </Link>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {users.map((role, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  background: "#f9fafb",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <div style={{ fontWeight: "500" }}>{role.role}</div>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                    {role.active} active / {role.count} total
                  </div>
                </div>
                <div
                  style={{
                    width: "60px",
                    height: "6px",
                    background: "#e5e7eb",
                    borderRadius: "3px",
                  }}
                >
                  <div
                    style={{
                      width: `${(role.active / role.count) * 100}%`,
                      height: "100%",
                      background: "#0b2b4a",
                      borderRadius: "3px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
            <Link
              href="/admin/users/new"
              style={{
                padding: "0.5rem 1rem",
                background: "#0b2b4a",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "0.9rem",
              }}
            >
              + Add New User
            </Link>
            <Link
              href="/admin/roles"
              style={{
                padding: "0.5rem 1rem",
                background: "white",
                color: "#0b2b4a",
                textDecoration: "none",
                borderRadius: "6px",
                border: "1px solid #0b2b4a",
                fontSize: "0.9rem",
              }}
            >
              Manage Roles
            </Link>
          </div>
        </div>

        {/* Recent Activity (Audit Log) */}
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
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.3rem", color: "#0b2b4a" }}>
              Recent Activity
            </h2>
            <Link
              href="/admin/audit-logs"
              style={{
                color: "#0b2b4a",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              View All →
            </Link>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                }}
              >
                <div>
                  <span style={{ fontWeight: "500" }}>{activity.user}</span>
                  <span style={{ color: "#6b7280", marginLeft: "0.5rem" }}>
                    {activity.action}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      padding: "0.2rem 0.5rem",
                      background: "#e5e7eb",
                      borderRadius: "12px",
                      fontSize: "0.7rem",
                      color: "#4b5563",
                    }}
                  >
                    {activity.role}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Distribution & Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Role Distribution Chart */}
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.3rem",
              color: "#0b2b4a",
              marginBottom: "1.5rem",
            }}
          >
            Role Distribution
          </h2>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {/* Simple pie chart representation */}
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background:
                  "conic-gradient(#0b2b4a 0deg 130deg, #1a4b76 130deg 250deg, #6b7280 250deg 360deg)",
              }}
            />
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#0b2b4a",
                    borderRadius: "2px",
                  }}
                />
                <span>Clinicians (8)</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#1a4b76",
                    borderRadius: "2px",
                  }}
                />
                <span>Staff (12)</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#6b7280",
                    borderRadius: "2px",
                  }}
                />
                <span>Admins (2)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.3rem",
              color: "#0b2b4a",
              marginBottom: "1.5rem",
            }}
          >
            Quick Actions
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}
          >
            <Link
              href="/admin/users/new"
              style={{
                padding: "1rem",
                background: "#f9fafb",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#0b2b4a",
                textAlign: "center",
                border: "1px solid #e5e7eb",
              }}
            >
              ➕ Create User
            </Link>
            <Link
              href="/admin/roles"
              style={{
                padding: "1rem",
                background: "#f9fafb",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#0b2b4a",
                textAlign: "center",
                border: "1px solid #e5e7eb",
              }}
            >
              👥 Manage Roles
            </Link>
            <Link
              href="/admin/audit-logs"
              style={{
                padding: "1rem",
                background: "#f9fafb",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#0b2b4a",
                textAlign: "center",
                border: "1px solid #e5e7eb",
              }}
            >
              📋 View Audit Logs
            </Link>
            <Link
              href="/admin/settings"
              style={{
                padding: "1rem",
                background: "#f9fafb",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#0b2b4a",
                textAlign: "center",
                border: "1px solid #e5e7eb",
              }}
            >
              ⚙️ System Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
