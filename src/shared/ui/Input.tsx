import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  variant?: "default" | "login";
}

const INPUT_VARIANT_CLASSES: Record<NonNullable<InputProps["variant"]>, string> = {
  default: "h-11 rounded-lg border border-[#d1d5db] bg-white px-4 text-[#111827] outline-none transition focus:border-[#111827]",
  login: "h-11 w-full h-12 rounded-lg border border-[#7D96A4] bg-white px-3 text-[#111827] outline-none transition focus:border-[#111827]",
};

export default function Input({ className = "", variant = "default", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`${INPUT_VARIANT_CLASSES[variant]} ${className}`.trim()}
    />
  );
}
