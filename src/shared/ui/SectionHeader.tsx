import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  description,
  actions,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-3 ${className}`.trim()}>
      <div>
        <h3 className="text-lg font-semibold text-[#111827]">{title}</h3>
        {subtitle && <p className="mt-1 text-sm font-medium text-slate-700">{subtitle}</p>}
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
