import { useEffect, useState } from 'react';
import { DEFAULT_LANDING_CONTENT, type LandingContent } from '../content/landingContent';

type MaybeWrapped<T> = { data?: T } | T;

let cachedContent: LandingContent | null = null;
let inflight: Promise<LandingContent> | null = null;

function resolveApiBaseUrl(): string {
  const rawBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (rawBase) {
    return rawBase.replace(/\/+$/, '');
  }
  return 'http://localhost:3500/api/v1';
}

function unwrapData<T>(payload: MaybeWrapped<T>): T {
  if (
    payload
    && typeof payload === 'object'
    && 'data' in payload
    && (payload as { data?: unknown }).data !== undefined
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

function normalizeLandingContent(raw: unknown): LandingContent {
  const payload = (raw && typeof raw === 'object') ? (raw as Partial<LandingContent>) : {};
  const hero = { ...DEFAULT_LANDING_CONTENT.hero, ...(payload.hero ?? {}) };
  const introParagraphs = Array.isArray(payload.intro?.paragraphs) && payload.intro.paragraphs.length > 0
    ? payload.intro.paragraphs
    : DEFAULT_LANDING_CONTENT.intro.paragraphs;
  const introTickerTexts = Array.isArray(payload.intro?.tickerTexts) && payload.intro.tickerTexts.length > 0
    ? payload.intro.tickerTexts
    : DEFAULT_LANDING_CONTENT.intro.tickerTexts;
  const intro = {
    ...DEFAULT_LANDING_CONTENT.intro,
    ...(payload.intro ?? {}),
    paragraphs: introParagraphs,
    tickerTexts: introTickerTexts,
  };
  const servicesItems = Array.isArray(payload.services?.items) && payload.services.items.length > 0
    ? payload.services.items
    : DEFAULT_LANDING_CONTENT.services.items;
  const services = {
    ...DEFAULT_LANDING_CONTENT.services,
    ...(payload.services ?? {}),
    items: servicesItems,
  };
  const processSteps = Array.isArray(payload.process?.steps) && payload.process.steps.length > 0
    ? payload.process.steps
    : DEFAULT_LANDING_CONTENT.process.steps;
  const process = {
    ...DEFAULT_LANDING_CONTENT.process,
    ...(payload.process ?? {}),
    steps: processSteps,
  };
  const impactStats = Array.isArray(payload.impact?.stats) && payload.impact.stats.length > 0
    ? payload.impact.stats
    : DEFAULT_LANDING_CONTENT.impact.stats;
  const impact = {
    ...DEFAULT_LANDING_CONTENT.impact,
    ...(payload.impact ?? {}),
    stats: impactStats,
  };
  const contact = { ...DEFAULT_LANDING_CONTENT.contact, ...(payload.contact ?? {}) };
  const privacyPolicy = { ...DEFAULT_LANDING_CONTENT.privacyPolicy, ...(payload.privacyPolicy ?? {}) };
  const userPolicy = { ...DEFAULT_LANDING_CONTENT.userPolicy, ...(payload.userPolicy ?? {}) };

  return {
    hero,
    intro,
    services,
    process,
    impact,
    contact,
    privacyPolicy,
    userPolicy,
    meta: payload.meta ?? undefined,
  };
}

async function fetchLandingContent(): Promise<LandingContent> {
  const baseUrl = resolveApiBaseUrl();
  const response = await fetch(`${baseUrl}/landing/content`);
  const json = await response.json().catch(() => ({}));
  const data = unwrapData(json as MaybeWrapped<unknown>);
  return normalizeLandingContent(data);
}

export function useLandingContent() {
  const [content, setContent] = useState<LandingContent>(cachedContent ?? DEFAULT_LANDING_CONTENT);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedContent);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!inflight) {
      inflight = fetchLandingContent();
    }

    inflight
      .then((data) => {
        cachedContent = data;
        if (isMounted) {
          setContent(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Landing content yuklenemedi.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { content, isLoading, error };
}
