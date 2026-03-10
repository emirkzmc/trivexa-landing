import type {
  CreateCustomerTicketInput,
  CustomerMeetingNote,
  CustomerPanelContract,
  CustomerPanelDashboardData,
  CustomerPanelProject,
  CustomerPanelProjectDetail,
  CustomerPanelProjectDetailItem,
  CustomerPanelProjectTask,
  CustomerPanelSession,
  CustomerPanelTicket,
} from "./types";

const DEFAULT_API_BASE_URL = "http://localhost:3500/api/v1";

type MaybeWrapped<T> = { data?: T } | T;

export class ApiHttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
  }
}

interface RawLoginUser {
  id?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  role?: unknown;
  forcePasswordChange?: unknown;
}

interface RawLoginData {
  accessToken?: unknown;
  access_token?: unknown;
  refreshToken?: unknown;
  refresh_token?: unknown;
  user?: RawLoginUser;
}

interface RawDashboardData {
  clientId?: unknown;
  activeProjects?: unknown;
  projects?: unknown;
  pendingInvoices?: unknown;
  unreadTickets?: unknown;
}

interface RawProjectDetailPayload {
  project?: unknown;
  taskMetrics?: unknown;
  taskSnapshot?: unknown;
}

interface RawTicketData {
  id?: unknown;
  projectId?: unknown;
  project_id?: unknown;
  projectName?: unknown;
  project_name?: unknown;
  subject?: unknown;
  description?: unknown;
  status?: unknown;
  approvalStatus?: unknown;
  approval_status?: unknown;
  stage?: unknown;
  priority?: unknown;
  type?: unknown;
  approvedAt?: unknown;
  approved_at?: unknown;
  createdAt?: unknown;
  created_at?: unknown;
}

interface RawMeetingData {
  id?: unknown;
  title?: unknown;
  date?: unknown;
  durationMinutes?: unknown;
  duration_minutes?: unknown;
  projectId?: unknown;
  project_id?: unknown;
  link?: unknown;
  notes?: unknown;
  summary?: unknown;
  createdAt?: unknown;
  created_at?: unknown;
  updatedAt?: unknown;
  updated_at?: unknown;
}

interface RawContractData {
  id?: unknown;
  contractId?: unknown;
  contract_id?: unknown;
  title?: unknown;
  contractTitle?: unknown;
  contract_title?: unknown;
  name?: unknown;
  description?: unknown;
  status?: unknown;
  startDate?: unknown;
  start_date?: unknown;
  endDate?: unknown;
  end_date?: unknown;
  value?: unknown;
  totalAmount?: unknown;
  total_amount?: unknown;
  signedUrl?: unknown;
  signed_url?: unknown;
  projectId?: unknown;
  project_id?: unknown;
  createdAt?: unknown;
  created_at?: unknown;
  updatedAt?: unknown;
  updated_at?: unknown;
}

function resolveApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (raw || DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}

function toRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return {};
}

function toStringValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function toNumberValue(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function toBooleanValue(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }
  if (typeof value === "number") return value === 1;
  return false;
}

function unwrapData<T>(payload: MaybeWrapped<T>): T {
  if (
    typeof payload === "object"
    && payload !== null
    && "data" in payload
    && (payload as { data?: unknown }).data !== undefined
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

function statusToProgress(status: string): string {
  const normalized = status.toUpperCase();
  if (normalized === "DONE" || normalized === "COMPLETED") return "%100";
  if (normalized === "IN_PROGRESS") return "%65";
  if (normalized === "ON_HOLD") return "%35";
  if (normalized === "PLANNING") return "%15";
  return "%0";
}

function normalizeProject(raw: unknown): CustomerPanelProject {
  const row = toRecord(raw);
  const status = (toStringValue(row.status) || "UNKNOWN").toUpperCase();

  return {
    id: toStringValue(row.id),
    name: toStringValue(row.name),
    status,
    progress: statusToProgress(status),
  };
}

function normalizeProjectDetailItem(raw: unknown): CustomerPanelProjectDetailItem {
  const row = toRecord(raw);
  return {
    id: toStringValue(row.id),
    name: toStringValue(row.name),
    description: toStringValue(row.description) || undefined,
    status: (toStringValue(row.status) || "UNKNOWN").toUpperCase(),
    budget: toNumberValue(row.budget) || undefined,
    startDate: toStringValue(row.startDate || row.start_date) || undefined,
    deadline: toStringValue(row.deadline) || undefined,
    createdAt: toStringValue(row.createdAt || row.created_at) || undefined,
    updatedAt: toStringValue(row.updatedAt || row.updated_at) || undefined,
  };
}

function normalizeProjectTask(raw: unknown): CustomerPanelProjectTask {
  const row = toRecord(raw);
  const assignee = toRecord(row.assignee);
  const firstName = toStringValue(assignee.firstName || assignee.first_name).trim();
  const lastName = toStringValue(assignee.lastName || assignee.last_name).trim();
  const assigneeName = `${firstName} ${lastName}`.trim();
  return {
    id: toStringValue(row.id),
    title: toStringValue(row.title) || "Gorev",
    status: (toStringValue(row.status) || "UNKNOWN").toUpperCase(),
    priority: toStringValue(row.priority) || undefined,
    updatedAt: toStringValue(row.updatedAt || row.updated_at) || undefined,
    dueDate: toStringValue(row.dueDate || row.due_date) || undefined,
    assigneeName: assigneeName || undefined,
    assigneeEmail: toStringValue(assignee.email) || undefined,
  };
}

function normalizeProjectDetail(payload: unknown): CustomerPanelProjectDetail | null {
  const record = toRecord(payload);
  const project = normalizeProjectDetailItem(record.project);
  if (!project.id) return null;

  const taskMetricsRecord = toRecord(record.taskMetrics);
  const taskMetrics = taskMetricsRecord && Object.keys(taskMetricsRecord).length > 0
    ? {
        total: toNumberValue(taskMetricsRecord.total),
        completed: toNumberValue(taskMetricsRecord.completed),
        percentage: toNumberValue(taskMetricsRecord.percentage),
      }
    : undefined;

  const taskSnapshotRecord = toRecord(record.taskSnapshot);
  const summaryRecord = toRecord(taskSnapshotRecord.summary);
  const byStatusRecord = toRecord(summaryRecord.byStatus);
  const taskSummary = summaryRecord && Object.keys(summaryRecord).length > 0
    ? {
        total: toNumberValue(summaryRecord.total),
        byStatus: {
          TODO: toNumberValue(byStatusRecord.TODO),
          IN_PROGRESS: toNumberValue(byStatusRecord.IN_PROGRESS),
          IN_REVIEW: toNumberValue(byStatusRecord.IN_REVIEW),
          BLOCKED: toNumberValue(byStatusRecord.BLOCKED),
          DONE: toNumberValue(byStatusRecord.DONE),
        },
        doneThisWeek: toNumberValue(summaryRecord.doneThisWeek || summaryRecord.done_this_week),
      }
    : undefined;

  const recentTasksRaw = Array.isArray(taskSnapshotRecord.recentTasks)
    ? taskSnapshotRecord.recentTasks
    : [];
  const recentTasks = recentTasksRaw.map((item) => normalizeProjectTask(item));

  return {
    project,
    taskMetrics,
    taskSummary,
    recentTasks,
  };
}

function normalizeTicket(raw: unknown): CustomerPanelTicket {
  const row = toRecord(raw);
  return {
    id: toStringValue(row.id),
    projectId: toStringValue(row.projectId || row.project_id) || undefined,
    projectName: toStringValue(row.projectName || row.project_name) || undefined,
    subject: toStringValue(row.subject),
    description: toStringValue(row.description),
    status: (toStringValue(row.status) || "OPEN").toUpperCase(),
    approvalStatus: (toStringValue(row.approvalStatus || row.approval_status) || "PENDING").toUpperCase(),
    stage: toStringValue(row.stage).toUpperCase() || undefined,
    priority: (toStringValue(row.priority) || "MEDIUM").toUpperCase(),
    type: (toStringValue(row.type) || "SUPPORT").toUpperCase(),
    approvedAt: toStringValue(row.approvedAt || row.approved_at) || undefined,
    createdAt: toStringValue(row.createdAt || row.created_at),
  };
}

function normalizeMeetingNote(raw: unknown): CustomerMeetingNote {
  const row = toRecord(raw);
  return {
    id: toStringValue(row.id),
    title: toStringValue(row.title) || "Toplanti",
    date: toStringValue(row.date),
    durationMinutes: toNumberValue(row.durationMinutes || row.duration_minutes),
    projectId: toStringValue(row.projectId || row.project_id) || undefined,
    link: toStringValue(row.link) || undefined,
    notes: toStringValue(row.notes) || undefined,
    summary: toStringValue(row.summary) || undefined,
    createdAt: toStringValue(row.createdAt || row.created_at) || undefined,
    updatedAt: toStringValue(row.updatedAt || row.updated_at) || undefined,
  };
}

function normalizeContract(raw: unknown): CustomerPanelContract {
  const row = toRecord(raw);
  return {
    id: toStringValue(row.id || row.contractId || row.contract_id),
    projectId: toStringValue(row.projectId || row.project_id) || undefined,
    title: toStringValue(row.title || row.contractTitle || row.contract_title || row.name),
    description: toStringValue(row.description) || undefined,
    status: (toStringValue(row.status) || "DRAFT").toUpperCase(),
    startDate: toStringValue(row.startDate || row.start_date) || undefined,
    endDate: toStringValue(row.endDate || row.end_date) || undefined,
    value: toNumberValue(row.value || row.totalAmount || row.total_amount) || undefined,
    signedUrl: toStringValue(row.signedUrl || row.signed_url) || undefined,
    createdAt: toStringValue(row.createdAt || row.created_at) || undefined,
    updatedAt: toStringValue(row.updatedAt || row.updated_at) || undefined,
  };
}

function extractTicketRows(payload: unknown): unknown[] {
  const first = unwrapData(payload as MaybeWrapped<unknown>);
  if (Array.isArray(first)) return first;

  const firstRecord = toRecord(first);
  if (Array.isArray(firstRecord.items)) return firstRecord.items;
  if (Array.isArray(firstRecord.data)) return firstRecord.data;

  const nested = unwrapData(first as MaybeWrapped<unknown>);
  if (Array.isArray(nested)) return nested;

  const nestedRecord = toRecord(nested);
  if (Array.isArray(nestedRecord.items)) return nestedRecord.items;
  if (Array.isArray(nestedRecord.data)) return nestedRecord.data;

  return [];
}

function extractMeetingRows(payload: unknown): unknown[] {
  const first = unwrapData(payload as MaybeWrapped<unknown>);
  if (Array.isArray(first)) return first;

  const firstRecord = toRecord(first);
  if (Array.isArray(firstRecord.items)) return firstRecord.items;
  if (Array.isArray(firstRecord.data)) return firstRecord.data;

  const nested = unwrapData(first as MaybeWrapped<unknown>);
  if (Array.isArray(nested)) return nested;

  const nestedRecord = toRecord(nested);
  if (Array.isArray(nestedRecord.items)) return nestedRecord.items;
  if (Array.isArray(nestedRecord.data)) return nestedRecord.data;

  return [];
}

function extractContractRows(payload: unknown): unknown[] {
  const first = unwrapData(payload as MaybeWrapped<unknown>);
  if (Array.isArray(first)) return first;

  const firstRecord = toRecord(first);
  if (Array.isArray(firstRecord.items)) return firstRecord.items;
  if (Array.isArray(firstRecord.data)) return firstRecord.data;
  if (Array.isArray(firstRecord.contracts)) return firstRecord.contracts;

  const nested = unwrapData(first as MaybeWrapped<unknown>);
  if (Array.isArray(nested)) return nested;

  const nestedRecord = toRecord(nested);
  if (Array.isArray(nestedRecord.items)) return nestedRecord.items;
  if (Array.isArray(nestedRecord.data)) return nestedRecord.data;
  if (Array.isArray(nestedRecord.contracts)) return nestedRecord.contracts;

  return [];
}

function extractErrorMessage(payload: unknown): string {
  const data = toRecord(payload);
  const direct = data.message;

  if (typeof direct === "string" && direct.trim()) {
    return direct;
  }

  const nested = toRecord(data.data);
  if (typeof nested.message === "string" && nested.message.trim()) {
    return nested.message;
  }

  return "İstek sırasında bir hata oluştu.";
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${resolveApiBaseUrl()}${path}`, init);
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : {};

  if (!response.ok) {
    throw new ApiHttpError(response.status, extractErrorMessage(payload));
  }

  return payload as T;
}

export async function loginCustomerPanel(
  email: string,
  password: string,
): Promise<CustomerPanelSession> {
  const payload = await requestJson<MaybeWrapped<RawLoginData>>("/portal/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = unwrapData(payload);
  const accessToken = toStringValue(data.accessToken || data.access_token);
  const refreshToken = toStringValue(data.refreshToken || data.refresh_token);
  const user = toRecord(data.user);
  const firstName = toStringValue(user.firstName).trim();
  const lastName = toStringValue(user.lastName).trim();
  const userName = `${firstName} ${lastName}`.trim() || "Müşteri";

  if (!accessToken || !refreshToken) {
    throw new Error("Giriş yanıtı geçersiz.");
  }

  return {
    accessToken,
    refreshToken,
    userId: toStringValue(user.id),
    userName,
    userEmail: toStringValue(user.email),
    role: toStringValue(user.role) || "CLIENT",
    forcePasswordChange: toBooleanValue(user.forcePasswordChange),
  };
}

export async function forceChangeCustomerPassword(
  clientUserId: string,
  newPassword: string,
): Promise<void> {
  await requestJson("/portal/force-change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientId: clientUserId,
      newPassword,
    }),
  });
}

export async function getCustomerDashboard(
  accessToken: string,
): Promise<CustomerPanelDashboardData> {
  const payload = await requestJson<MaybeWrapped<RawDashboardData>>("/portal/dashboard", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = unwrapData(payload);
  const projectsRaw = Array.isArray(data.projects) ? data.projects : [];
  const projects = projectsRaw.map((item) => normalizeProject(item));

  return {
    clientId: toStringValue(data.clientId) || undefined,
    activeProjects: toNumberValue(data.activeProjects || projects.length),
    pendingInvoices: toNumberValue(data.pendingInvoices),
    unreadTickets: toNumberValue(data.unreadTickets),
    projects,
  };
}

export async function getCustomerProjectDetail(
  accessToken: string,
  projectId: string,
): Promise<CustomerPanelProjectDetail> {
  const payload = await requestJson<MaybeWrapped<RawProjectDetailPayload>>(
    `/portal/projects/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = unwrapData(payload);
  const normalized = normalizeProjectDetail(data);
  if (!normalized) {
    throw new Error("Proje detayi alinamadi.");
  }
  return normalized;
}

export async function getCustomerTickets(accessToken: string): Promise<CustomerPanelTicket[]> {
  const payload = await requestJson<unknown>("/portal/requests", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const rows = extractTicketRows(payload);
  return rows.map((item) => normalizeTicket(item as RawTicketData));
}

export async function createCustomerTicket(
  accessToken: string,
  input: CreateCustomerTicketInput,
): Promise<CustomerPanelTicket> {
  const payload = await requestJson<unknown>("/portal/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      subject: input.subject,
      description: input.description,
      priority: input.priority || "MEDIUM",
      type: input.type || "SUPPORT",
      projectId: input.projectId || undefined,
    }),
  });

  const data = unwrapData(payload as MaybeWrapped<unknown>);
  return normalizeTicket(data as RawTicketData);
}

export async function getCustomerMeetingNotes(
  accessToken: string,
  options?: {
    clientId?: string;
    projectId?: string;
  },
): Promise<CustomerMeetingNote[]> {
  const params = new URLSearchParams();

  if (options?.clientId) {
    params.set("clientId", options.clientId);
  }

  if (options?.projectId) {
    params.set("projectId", options.projectId);
  }

  const query = params.toString();
  const path = query ? `/meetings?${query}` : "/meetings";

  const payload = await requestJson<unknown>(path, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const rows = extractMeetingRows(payload);
  return rows.map((item) => normalizeMeetingNote(item as RawMeetingData));
}

export async function getCustomerContracts(
  accessToken: string,
  options?: { status?: string },
): Promise<CustomerPanelContract[]> {
  const params = new URLSearchParams();
  if (options?.status) {
    params.set("status", options.status);
  }

  const query = params.toString();
  const path = query ? `/portal/contracts?${query}` : "/portal/contracts";

  const payload = await requestJson<unknown>(path, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const rows = extractContractRows(payload);
  return rows.map((item) => normalizeContract(item as RawContractData));
}

export async function getCustomerContractDetail(
  accessToken: string,
  contractId: string,
): Promise<CustomerPanelContract> {
  const payload = await requestJson<unknown>(`/portal/contracts/${contractId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = unwrapData(payload as MaybeWrapped<unknown>);
  const normalized = normalizeContract(data as RawContractData);
  if (!normalized.id) {
    throw new Error("Sozlesme detayi alinamadi.");
  }
  return normalized;
}
