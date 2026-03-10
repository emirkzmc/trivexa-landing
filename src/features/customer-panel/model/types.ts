export const CUSTOMER_PANEL_PATHS = [
  "/customer-panel/dashboard",
  "/customer-panel/projeler",
  "/customer-panel/sozlesmeler",
  "/customer-panel/talepler",
  "/customer-panel/notlar",
  "/customer-panel/onaylar",
] as const;

export const CUSTOMER_PANEL_PROJECT_DETAIL_PREFIX = "/customer-panel/projeler/";
export const CUSTOMER_PANEL_CONTRACT_DETAIL_PREFIX = "/customer-panel/sozlesmeler/";

export type CustomerPanelNavPath = (typeof CUSTOMER_PANEL_PATHS)[number];
export type CustomerPanelProjectDetailPath = `${typeof CUSTOMER_PANEL_PROJECT_DETAIL_PREFIX}${string}`;
export type CustomerPanelContractDetailPath = `${typeof CUSTOMER_PANEL_CONTRACT_DETAIL_PREFIX}${string}`;
export type CustomerPanelPath = CustomerPanelNavPath | CustomerPanelProjectDetailPath | CustomerPanelContractDetailPath;

export interface CustomerPanelNavItem {
  label: string;
  path: CustomerPanelNavPath;
  icon: "dashboard" | "projects" | "contracts" | "requests" | "notes" | "approvals";
}

export interface CustomerPanelProject {
  id: string;
  name: string;
  status: string;
  progress: string;
}

export interface CustomerPanelProjectDetailItem {
  id: string;
  name: string;
  description?: string;
  status: string;
  budget?: number;
  startDate?: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerPanelProjectTask {
  id: string;
  title: string;
  status: string;
  priority?: string;
  updatedAt?: string;
  dueDate?: string;
  assigneeName?: string;
  assigneeEmail?: string;
}

export interface CustomerPanelProjectDetail {
  project: CustomerPanelProjectDetailItem;
  taskMetrics?: {
    total: number;
    completed: number;
    percentage: number;
  };
  taskSummary?: {
    total: number;
    byStatus: {
      TODO: number;
      IN_PROGRESS: number;
      IN_REVIEW: number;
      BLOCKED: number;
      DONE: number;
    };
    doneThisWeek: number;
  };
  recentTasks?: CustomerPanelProjectTask[];
}

export interface CustomerPanelContract {
  id: string;
  projectId?: string;
  title: string;
  description?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  value?: number;
  signedUrl?: string;
  createdAt?: string;
  updatedAt?: string;
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
