import type { ReactNode } from "react";

type LabelVariant = "section" | "field";

interface LabelProps {
  children: ReactNode;
  variant?: LabelVariant;
  className?: string;
  htmlFor?: string;
}

export default function Label({ children, variant = "section", className = "", htmlFor }: LabelProps) {
  const variantClass =
    variant === "section"
      ? "text-sm font-semibold uppercase tracking-[0.2em] text-[#485062]"
      : "text-sm font-medium text-[#111827]";

  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={`${variantClass} ${className}`.trim()}>
        {children}
      </label>
    );
  }

  return <p className={`${variantClass} ${className}`.trim()}>{children}</p>;
}
