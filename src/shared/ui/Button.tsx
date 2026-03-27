import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  children?: ReactNode;
  className?: string;
  variant?: "default" | "login" ;
}

const BUTTON_VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "inline-flex items-center justify-center  px-12 py-2",
  login: "mt-2 h-11 w-full rounded-lg bg-black  text-sm font-medium text-white transition hover:bg-[#292929] hover:cursor-pointer  inline-flex items-center justify-center",
};

export default function Button({
  text,
  children,
  className = "",
  variant = "default",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={`${BUTTON_VARIANT_CLASSES[variant]} ${className} cursor-pointer`.trim()} {...rest}>
      {children ?? text}
    </button>
  );
}
