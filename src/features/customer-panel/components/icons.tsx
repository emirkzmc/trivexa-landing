import type { CustomerPanelNavItem } from "../model/types";

export function SquareGridIcon({ color = "#111827" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" fill={color} />
      <rect x="14" y="3" width="7" height="7" fill={color} />
      <rect x="3" y="14" width="7" height="7" fill={color} />
      <rect x="14" y="14" width="7" height="7" fill={color} />
    </svg>
  );
}

export function DashboardIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3v18h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 17V9M13 17V5M8 17v-3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function FolderIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 6.5A2.5 2.5 0 0 1 5.5 4h4.4l1.7 2.2h6.9A2.5 2.5 0 0 1 21 8.7v9.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 11h2.2M8 14h2.2M13.5 11h2.2M13.5 14h2.2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ListIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 4H7a2 2 0 0 0-2 2v1" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 20H7a2 2 0 0 1-2-2v-1" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9.5" y="3.5" width="11" height="17" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M12.5 8h5M12.5 12h5M12.5 16h5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="1.8" />
      <path
        d="m7.5 12 3 3 6-6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NoteIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function DocumentIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 3h6l5 5v13a1 1 0 0 1-1 1H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronRightIcon({ color = "#6B7280" }: { color?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 6 6 6-6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 17l4-5-4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function getItemIcon(icon: CustomerPanelNavItem["icon"], color?: string) {
  if (icon === "dashboard") return <DashboardIcon color={color} />;
  if (icon === "projects") return <FolderIcon color={color} />;
  if (icon === "contracts") return <DocumentIcon color={color} />;
  if (icon === "requests") return <ListIcon color={color} />;
  if (icon === "notes") return <NoteIcon color={color} />;
  return <CheckIcon color={color} />;
}
