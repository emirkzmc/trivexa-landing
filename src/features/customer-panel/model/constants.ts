import type { CustomerPanelNavItem, CustomerPanelPath } from "./types";

export const CUSTOMER_PANEL_DEFAULT_PATH: CustomerPanelPath = "/customer-panel/dashboard";

export const PAGE_NAMES: Record<string, string> = {
  "/customer-panel/dashboard": "Dashboard",
  "/customer-panel/projeler": "Projelerim",
  "/customer-panel/sozlesmeler": "Sozlesmelerim",
  "/customer-panel/talepler": "Taleplerim",
  "/customer-panel/notlar": "Görüşme Notları",
  "/customer-panel/onaylar": "Onay Bekleyen",
};

export const NAV_ITEMS: CustomerPanelNavItem[] = [
  { label: "Dashboard", path: "/customer-panel/dashboard", icon: "dashboard" },
  { label: "Projelerim", path: "/customer-panel/projeler", icon: "projects" },
  { label: "Sozlesmelerim", path: "/customer-panel/sozlesmeler", icon: "contracts" },
  { label: "Taleplerim", path: "/customer-panel/talepler", icon: "requests" },
  { label: "Görüşme Notları", path: "/customer-panel/notlar", icon: "notes" },
  { label: "Onay Bekleyen", path: "/customer-panel/onaylar", icon: "approvals" },
];

export const SIDEBAR_EXPANDED_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 100;
export const MOBILE_SIDEBAR_WIDTH = 280;
export const MOBILE_BREAKPOINT = 768;

