import type { HTMLAttributes, ReactNode } from "react";

interface SectionBlockProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}

export default function SectionBlock({
  className = "",
  containerClassName = "",
  children,
  ...rest
}: SectionBlockProps) {
  return (
    <section className={`px-6 py-24 md:px-20 ${className}`.trim()} {...rest}>
      <div className={`mx-auto max-w-6xl ${containerClassName}`.trim()}>
        {children}
      </div>
    </section>
  );
}
