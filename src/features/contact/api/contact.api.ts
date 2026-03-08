export interface ContactFormPayload {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

interface ContactFormResponse {
  accepted: boolean;
  delivered: boolean;
  requestId?: string;
  reason?: string;
}

function resolveApiBaseUrl(): string {
  const rawBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (rawBase) {
    return rawBase.replace(/\/+$/, '');
  }
  return 'http://localhost:3500/api/v1';
}

export async function submitLandingContactForm(
  payload: ContactFormPayload,
): Promise<ContactFormResponse> {
  const baseUrl = resolveApiBaseUrl();
  const response = await fetch(`${baseUrl}/landing/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => ({}));
  const data = (json && typeof json === 'object' && 'data' in json)
    ? (json as { data: ContactFormResponse }).data
    : (json as ContactFormResponse);

  if (!response.ok) {
    const message = typeof (json as { message?: unknown })?.message === 'string'
      ? (json as { message: string }).message
      : 'İletişim formu gönderilemedi.';
    throw new Error(message);
  }

  return data;
}
