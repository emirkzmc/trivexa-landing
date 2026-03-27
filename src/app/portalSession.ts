import type { CustomerPanelSession } from '../features/customer-panel/model/types';

const CUSTOMER_PANEL_SESSION_KEY = 'trivexa-landing-customer-session';

export interface PortalSessionStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

const noopStorage: PortalSessionStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export function resolvePortalSessionStorage(): PortalSessionStorage {
  if (typeof window === 'undefined') {
    return noopStorage;
  }
  return window.localStorage;
}

export function readPortalSession(
  storage: PortalSessionStorage = resolvePortalSessionStorage(),
): CustomerPanelSession | null {
  try {
    const raw = storage.getItem(CUSTOMER_PANEL_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CustomerPanelSession;
    const token = parsed?.accessToken;
    if (
      !token
      || token === 'undefined'
      || token === 'null'
      || typeof token !== 'string'
    ) {
      storage.removeItem(CUSTOMER_PANEL_SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    storage.removeItem(CUSTOMER_PANEL_SESSION_KEY);
    return null;
  }
}

export function persistPortalSession(
  session: CustomerPanelSession,
  storage: PortalSessionStorage = resolvePortalSessionStorage(),
) {
  storage.setItem(CUSTOMER_PANEL_SESSION_KEY, JSON.stringify(session));
}

export function clearPortalSession(
  storage: PortalSessionStorage = resolvePortalSessionStorage(),
) {
  storage.removeItem(CUSTOMER_PANEL_SESSION_KEY);
}
