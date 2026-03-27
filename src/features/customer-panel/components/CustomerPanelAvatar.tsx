interface CustomerPanelAvatarProps {
  name: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
}

export default function CustomerPanelAvatar({
  name,
  size = 34,
  backgroundColor = "#11182720",
  textColor = "#111827",
}: CustomerPanelAvatarProps) {
  const initials = (name.trim().charAt(0) || "M").toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        color: textColor,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
