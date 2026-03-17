"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Activity, ArrowLeft, FileText, FlaskConical, UserRound } from "lucide-react";

type PatientSubnavProps = {
  patientId: string;
};

const tabs = [
  { label: "Overview", href: (id: string) => `/patients/${id}`, icon: UserRound },
  { label: "Documents", href: (id: string) => `/patients/${id}/documents`, icon: FileText },
  { label: "Labs", href: (id: string) => `/patients/${id}/labs`, icon: FlaskConical },
  { label: "Visits", href: (id: string) => `/patients/${id}/visits`, icon: Activity },
];

export default function PatientSubnav({ patientId }: PatientSubnavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeVisitId = searchParams.get("activeVisit");
  const overviewHref = `/patients/${patientId}`;
  const visitsHref = `/patients/${patientId}/visits`;
  const onOverviewPage = pathname === overviewHref;
  const onVisitsPage = pathname === visitsHref;
  const visitContext = activeVisitId ? `?activeVisit=${activeVisitId}` : "";

  const backHref = activeVisitId
    ? onVisitsPage
      ? overviewHref
      : `${visitsHref}?activeVisit=${activeVisitId}`
    : onOverviewPage
      ? "/patients"
      : overviewHref;
  const backLabel = activeVisitId
    ? onVisitsPage
      ? "Back to Profile"
      : "Back to Active Visit"
    : onOverviewPage
      ? "Back to Patients"
      : "Back to Profile";

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <Link href={backHref} className="btn btn-ghost" style={{ marginBottom: "0.85rem" }}>
        <ArrowLeft size={14} /> {backLabel}
      </Link>

      <div className="tab-nav">
        {tabs.map((tab) => {
          const href = `${tab.href(patientId)}${visitContext}`;
          const Icon = tab.icon;
          const active = pathname === tab.href(patientId);

          return (
            <Link key={href} href={href} className={`tab-link${active ? " active" : ""}`}>
              <Icon size={15} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
