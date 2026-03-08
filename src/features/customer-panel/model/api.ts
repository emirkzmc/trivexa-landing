import type {
  CreateCustomerTicketInput,
  CustomerPanelDashboardData,
  CustomerPanelProject,
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
  activeProjects?: unknown;
  projects?: unknown;
  pendingInvoices?: unknown;
  unreadTickets?: unknown;
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
  priority?: unknown;
  type?: unknown;
  createdAt?: unknown;
  created_at?: unknown;
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

function normalizeTicket(raw: unknown): CustomerPanelTicket {
  const row = toRecord(raw);
  return {
    id: toStringValue(row.id),
    projectId: toStringValue(row.projectId || row.project_id) || undefined,
    projectName: toStringValue(row.projectName || row.project_name) || undefined,
    subject: toStringValue(row.subject),
    description: toStringValue(row.description),
    status: (toStringValue(row.status) || "OPEN").toUpperCase(),
    priority: (toStringValue(row.priority) || "MEDIUM").toUpperCase(),
    type: (toStringValue(row.type) || "SUPPORT").toUpperCase(),
    createdAt: toStringValue(row.createdAt || row.created_at),
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

  return "Istek sirasinda bir hata olustu.";
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
  const userName = `${firstName} ${lastName}`.trim() || "Musteri";

  if (!accessToken || !refreshToken) {
    throw new Error("Giris yaniti gecersiz.");
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
    activeProjects: toNumberValue(data.activeProjects || projects.length),
    pendingInvoices: toNumberValue(data.pendingInvoices),
    unreadTickets: toNumberValue(data.unreadTickets),
    projects,
  };
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
