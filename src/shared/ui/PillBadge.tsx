import type { ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "info";

interface PillBadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-slate-200 bg-slate-50 text-slate-600",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  info: "border-indigo-200 bg-indigo-50 text-indigo-700",
};

export default function PillBadge({ children, tone = "neutral", className = "" }: PillBadgeProps) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${toneClasses[tone]} ${className}`.trim()}>
      {children}
    </span>
  );
}
