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
  clientId?: string;
  activeProjects: number;
  pendingInvoices: number;
  unreadTickets: number;
  projects: CustomerPanelProject[];
}

export interface CustomerPanelTicket {
  id: string;
  subject: string;
  description: string;
  status: string;
  approvalStatus: string;
  stage?: string;
  priority: string;
  type: string;
  projectId?: string;
  projectName?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface CustomerMeetingNote {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  projectId?: string;
  link?: string;
  notes?: string;
  summary?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerTicketInput {
  subject: string;
  description: string;
  priority?: string;
  type?: string;
  projectId?: string;
}

export interface CustomerPanelSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  forcePasswordChange: boolean;
}
