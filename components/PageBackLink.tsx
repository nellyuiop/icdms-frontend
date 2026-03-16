import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type PageBackLinkProps = {
  href?: string;
  label?: string;
};

export default function PageBackLink({ href = "/dashboard", label = "Back to Dashboard" }: PageBackLinkProps) {
  return (
    <Link href={href} className="btn btn-ghost" style={{ marginBottom: "1rem" }}>
      <ArrowLeft size={14} /> {label}
    </Link>
  );
}
