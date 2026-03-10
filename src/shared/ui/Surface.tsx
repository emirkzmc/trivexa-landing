import type { HTMLAttributes, ReactNode } from "react";

type SurfaceTag = "section" | "article" | "div";

interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: SurfaceTag;
  children: ReactNode;
  className?: string;
}

export default function Surface({
  as = "section",
  children,
  className = "",
  ...rest
}: SurfaceProps) {
  const Component = as;
  const classes = `rounded-xl border border-slate-200 bg-white ${className}`.trim();

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}
