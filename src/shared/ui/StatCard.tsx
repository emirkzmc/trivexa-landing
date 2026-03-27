import type { ReactNode } from "react";
import Surface from "./Surface";

interface StatCardProps {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  className?: string;
}

export default function StatCard({
  label,
  value,
  valueClassName = "text-2xl font-semibold text-[#111827]",
  className = "",
}: StatCardProps) {
  return (
    <Surface as="article" className={`rounded-lg bg-slate-50 p-4 ${className}`.trim()}>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 ${valueClassName}`.trim()}>{value}</p>
    </Surface>
  );
}
