import type { Metadata } from "next";
import Navbar from "../components/Layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClinIQ - Intelligent Clinical Data Management System",
  description: "Healthcare patient management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
