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
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <TopBar />
          <main
            style={{
              flex: 1,
              padding: "1.5rem",
              background: "#f5f7fb",
              overflowY: "auto",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
