export const CUSTOMER_PANEL_PATHS = [
  "/customer-panel/dashboard",
  "/customer-panel/projeler",
  "/customer-panel/talepler",
  "/customer-panel/notlar",
  "/customer-panel/onaylar",
] as const;

export type CustomerPanelPath = (typeof CUSTOMER_PANEL_PATHS)[number];

export interface CustomerPanelNavItem {
  label: string;
  path: CustomerPanelPath;
  icon: "dashboard" | "projects" | "requests" | "notes" | "approvals";
}

export interface CustomerPanelProject {
  id: string;
  name: string;
  status: string;
  progress: string;
}

export interface CustomerPanelDashboardData {
  activeProjects: number;
  pendingInvoices: number;
  unreadTickets: number;
  projects: CustomerPanelProject[];
}

export interface CustomerPanelSession {
  accessToken: string;
  refreshToken: string;
  userName: string;
  userEmail: string;
  role: string;
}
