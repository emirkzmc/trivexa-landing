import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`h-11 rounded-lg border border-[#d1d5db] bg-white px-4 text-[#111827] outline-none transition focus:border-[#111827] ${className}`.trim()}
    />
  );
}
