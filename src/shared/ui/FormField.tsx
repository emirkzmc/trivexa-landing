import type { ReactNode } from "react";
import Label from "./Label";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export default function FormField({ label, htmlFor, children, className = "" }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <Label variant="field" htmlFor={htmlFor}>
        {label}
      </Label>
      {children}
    </div>
  );
}
