import { requestJson, unwrapData, type MaybeWrapped } from "../../../shared/api/httpClient";

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

export async function submitLandingContactForm(
  payload: ContactFormPayload,
): Promise<ContactFormResponse> {
  const response = await requestJson<MaybeWrapped<ContactFormResponse>>("/landing/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }, {
    errorMessage: "Iletisim formu gonderilemedi.",
  });

  return unwrapData(response);
}
