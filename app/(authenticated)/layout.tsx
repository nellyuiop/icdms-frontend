"use client";

import { AuthProvider } from "@/app/contexts/AuthContext";
import Sidebar from "@/components/Layout/Sidebar";
import TopBar from "@/components/Layout/TopBar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Sidebar />
        <div className="app-main-wrapper">
          <TopBar />
          <main className="app-content">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
