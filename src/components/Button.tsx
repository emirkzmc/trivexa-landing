export interface ButtonProps {
    text: string;
    className?: string;
    onClick?: () => void;
}
export default function Button({ text, className, onClick }: ButtonProps) {
  return (
    <div>
        <button onClick={onClick} className={`bg-white px-12 py-2 ${className}`}>{text}</button>
    </div>
  )
}
