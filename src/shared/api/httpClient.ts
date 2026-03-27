export type MaybeWrapped<T> = { data?: T } | T;

const DEFAULT_API_BASE_URL = 'http://localhost:3500/api/v1';

export class ApiHttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiHttpError';
    this.status = status;
  }
}

export function resolveApiBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  return (raw || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
}

function toRecord(value: unknown): Record<string, unknown> {
  if (typeof value === 'object' && value !== null) {
    return value as Record<string, unknown>;
  }
  return {};
}

function extractErrorMessage(payload: unknown): string {
  const data = toRecord(payload);
  const direct = data.message;

  if (typeof direct === 'string' && direct.trim()) {
    return direct;
  }

  const nested = toRecord(data.data);
  if (typeof nested.message === 'string' && nested.message.trim()) {
    return nested.message;
  }

  return '';
}

export function unwrapData<T>(payload: MaybeWrapped<T>): T {
  if (
    typeof payload === 'object'
    && payload !== null
    && 'data' in payload
    && (payload as { data?: unknown }).data !== undefined
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export async function requestJson<T>(
  pathOrUrl: string,
  init?: RequestInit,
  options?: {
    baseUrl?: string;
    errorMessage?: string;
  },
): Promise<T> {
  const baseUrl = options?.baseUrl ?? resolveApiBaseUrl();
  const url = /^https?:\/\//i.test(pathOrUrl) ? pathOrUrl : `${baseUrl}${pathOrUrl}`;
  const response = await fetch(url, init);
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : {};

  if (!response.ok) {
    const message =
      extractErrorMessage(payload)
      || options?.errorMessage
      || `Istek basarisiz oldu (${response.status}).`;
    throw new ApiHttpError(response.status, message);
  }

  return payload as T;
}
