import type { ReactNode } from "react";

export interface LoginBackgroundProps {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  showGradientOrbs?: boolean;
}

export default function LoginBackground({
  children,
  className = "",
  contentClassName = "",
  showGradientOrbs = true,
}: LoginBackgroundProps) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-white ${className}`.trim()}>
      {showGradientOrbs && (
        <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#7A968B]/30 blur-3xl" />
      )}
      {showGradientOrbs && (
        <div className="pointer-events-none absolute right-28 bottom-0 h-80 w-80 rounded-full bg-[#A09176]/30 blur-3xl" />
      )}
      {showGradientOrbs && (
        <div className="pointer-events-none absolute right-6 bottom-0 h-72 w-72 rounded-full bg-[#787665]/30 blur-3xl" />
      )}

      <div className={`relative z-10 ${contentClassName}`.trim()}>{children}</div>
    </div>
  );
}
