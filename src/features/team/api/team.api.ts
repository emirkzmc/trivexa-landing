export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  isActive: boolean;
}

export interface TeamDepartment {
  department: string;
  members: TeamMember[];
}

interface TeamPayload {
  departments?: TeamDepartment[];
}

const DEFAULT_API_BASE_URL = "http://localhost:3500/api/v1";

function resolveApiBaseUrl(): string {
  const rawBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (rawBase) {
    return rawBase.replace(/\/+$/, "");
  }
  return DEFAULT_API_BASE_URL;
}

function resolveCandidateUrls(): string[] {
  const base = resolveApiBaseUrl();
  const candidates = new Set<string>();

  candidates.add(`${base}/landing/team`);

  if (!/\/api\/v1$/i.test(base)) {
    candidates.add(`${base}/api/v1/landing/team`);
  }

  if (/\/landing$/i.test(base)) {
    candidates.add(`${base}/team`);
    candidates.add(`${base.replace(/\/landing$/i, "")}/landing/team`);
  }

  candidates.add(`${DEFAULT_API_BASE_URL}/landing/team`);
  return Array.from(candidates);
}

export async function fetchTeamByDepartment(): Promise<TeamDepartment[]> {
  const candidateUrls = resolveCandidateUrls();
  let lastErrorMessage = "Takim bilgileri alinamadi.";

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url);
      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = typeof (json as { message?: unknown })?.message === "string"
          ? (json as { message: string }).message
          : `Takim endpointine ulasilamadi (${response.status}).`;
        lastErrorMessage = message;
        continue;
      }

      const data = (json && typeof json === "object" && "data" in json)
        ? (json as { data?: TeamPayload }).data
        : (json as TeamPayload);

      return Array.isArray(data?.departments) ? data.departments : [];
    } catch {
      lastErrorMessage = "Takim endpointine baglanirken ag hatasi olustu.";
    }
  }

  throw new Error(lastErrorMessage);
}
