"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Role = "ADMIN" | "CLINICIAN" | "STAFF";

const roleConfig: Record<Role, { label: string; badgeClass: string }> = {
  ADMIN: { label: "Admin", badgeClass: "badge badge-admin" },
  CLINICIAN: { label: "Clinician", badgeClass: "badge badge-clinician" },
  STAFF: { label: "Staff", badgeClass: "badge badge-staff" },
};

const roles: Role[] = ["STAFF", "CLINICIAN", "ADMIN"];

type RoleSelectProps = {
  value: string;
  onChange: (role: string) => void;
};

export default function RoleSelect({ value, onChange }: RoleSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = roleConfig[value as Role] || roleConfig.STAFF;

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 8px",
          background: "white",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "0.85rem",
          fontFamily: "inherit",
          transition: "all var(--transition)",
          whiteSpace: "nowrap",
        }}
      >
        <span
          className={current.badgeClass}
          style={{ color: "white", fontSize: "0.72rem" }}
        >
          {current.label}
        </span>
        <ChevronDown
          size={12}
          style={{
            color: "var(--gray-400)",
            transition: "transform var(--transition)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            boxShadow: "var(--shadow-md)",
            zIndex: 50,
            minWidth: "120px",
            overflow: "hidden",
          }}
        >
          {roles.map((role) => {
            const cfg = roleConfig[role];
            const isSelected = role === value;
            return (
              <button
                key={role}
                type="button"
                onClick={() => {
                  onChange(role);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  background: isSelected ? "var(--gray-50)" : "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--gray-100)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontFamily: "inherit",
                  textAlign: "left",
                  transition: "background var(--transition)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--gray-50)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isSelected
                    ? "var(--gray-50)"
                    : "transparent";
                }}
              >
                <span
                  className={cfg.badgeClass}
                  style={{ color: "white", fontSize: "0.72rem" }}
                >
                  {cfg.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
