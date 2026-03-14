import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
