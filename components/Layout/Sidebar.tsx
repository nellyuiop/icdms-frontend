"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCog,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const mainLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
    { href: "/patients", label: "Patients", icon: Users, show: true },
    { href: "/appointments", label: "Appointments", icon: Calendar, show: true },
  ];

  const adminLinks = [
    { href: "/admin/users", label: "Users", icon: UserCog, show: isAdmin },
    { href: "/admin/roles", label: "Roles", icon: Shield, show: isAdmin },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const renderLink = (link: typeof mainLinks[number]) => {
    const active = isActive(link.href);
    const Icon = link.icon;
    return (
      <Link
        key={link.href}
        href={link.href}
        className={`sidebar-link${active ? " active" : ""}`}
        title={collapsed ? link.label : undefined}
      >
        <Icon className="sidebar-link-icon" size={18} />
        {!collapsed && <span>{link.label}</span>}
      </Link>
    );
  };

  const visibleAdmin = adminLinks.filter((l) => l.show);

  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
      <div className="sidebar-header">
        {!collapsed && <span className="sidebar-brand">ClinIQ</span>}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="sidebar-toggle"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {!collapsed && <div className="sidebar-section-label">Menu</div>}
        {mainLinks.filter((l) => l.show).map(renderLink)}

        {visibleAdmin.length > 0 && (
          <>
            {!collapsed && <div className="sidebar-section-label">Admin</div>}
            {visibleAdmin.map(renderLink)}
          </>
        )}
      </nav>
    </aside>
  );
}
