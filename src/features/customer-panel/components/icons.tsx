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
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke={color} strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" stroke={color} strokeWidth="1.8" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" stroke={color} strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

export function FolderIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4.2l1.8 2h7A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z"
        stroke={color}
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ListIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="5" cy="6" r="1.5" fill={color} />
      <circle cx="5" cy="12" r="1.5" fill={color} />
      <circle cx="5" cy="18" r="1.5" fill={color} />
      <path d="M9 6h10M9 12h10M9 18h10" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="1.8" />
      <path
        d="m8 12 2.5 2.5L16 9"
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
  if (icon === "requests") return <ListIcon color={color} />;
  if (icon === "notes") return <NoteIcon color={color} />;
  return <CheckIcon color={color} />;
}
