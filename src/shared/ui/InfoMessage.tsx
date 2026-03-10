import Surface from "./Surface";

type MessageTone = "neutral" | "error" | "success";

interface InfoMessageProps {
  message: string;
  tone?: MessageTone;
  className?: string;
}

const toneClasses: Record<MessageTone, string> = {
  neutral: "border-slate-200 bg-white text-slate-600",
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function InfoMessage({ message, tone = "neutral", className = "" }: InfoMessageProps) {
  return (
    <Surface className={`p-6 text-sm ${toneClasses[tone]} ${className}`.trim()}>
      {message}
    </Surface>
  );
}
