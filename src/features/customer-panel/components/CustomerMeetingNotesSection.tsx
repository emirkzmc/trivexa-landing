import { useEffect, useMemo, useState, type FormEvent } from "react";
import type {
  CreateCustomerTicketInput,
  CustomerMeetingNote,
  CustomerPanelProject,
  CustomerPanelTicket,
} from "../model/types";

interface CustomerMeetingNotesSectionProps {
  meetingNotes: CustomerMeetingNote[];
  isLoading: boolean;
  errorMessage: string | null;
  meetingRequests: CustomerPanelTicket[];
  isLoadingMeetingRequests: boolean;
  meetingRequestsErrorMessage: string | null;
  isCreatingMeetingRequest: boolean;
  meetingRequestErrorMessage: string | null;
  projects: CustomerPanelProject[];
  selectedProjectId: string;
  onProjectChange: (projectId: string) => void;
  onCreateMeetingRequest: (input: CreateCustomerTicketInput) => Promise<void>;
}

interface CalendarCell {
  key: string;
  date: Date;
  day: number;
  isCurrentMonth: boolean;
}

const WEEKDAY_LABELS = ["Pzt", "Sal", "Car", "Per", "Cum", "Cmt", "Paz"];
const MONTH_LABELS = [
  "Ocak",
  "Subat",
  "Mart",
  "Nisan",
  "Mayis",
  "Haziran",
  "Temmuz",
  "Agustos",
  "Eylul",
  "Ekim",
  "Kasim",
  "Aralik",
];

function toDateKey(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateTime(value?: string): string {
  const parsed = parseDate(value);
  if (!parsed) return "-";
  return parsed.toLocaleString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(value?: string): string {
  const parsed = parseDate(value);
  if (!parsed) return "-";
  return parsed.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function extractRequestedDateTime(value?: string): string {
  const text = String(value || "");
  const match = text.match(/tercih edilen tarih-saat:\s*([^\r\n]+)/i);
  return match?.[1]?.trim() || "";
}

function extractRequestedDuration(value?: string): string {
  const text = String(value || "");
  const match = text.match(/tahmini sure:\s*(\d+)/i);
  const parsed = Number.parseInt(match?.[1] || "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return "-";
  return `${parsed} dk`;
}

function mapRequestStatus(item: CustomerPanelTicket): string {
  const approval = (item.approvalStatus || "").toUpperCase();
  const status = (item.status || "").toUpperCase();
  if (status === "CLOSED" || status === "COMPLETED" || status === "RESOLVED") {
    return "Tamamlandi";
  }
  if (approval === "APPROVED") return "Onaylandi";
  if (approval === "REJECTED") return "Reddedildi";
  return "Onay Bekliyor";
}

function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return "-";
  if (minutes < 60) return `${minutes} dk`;
  const hours = Math.floor(minutes / 60);
  const leftMinutes = minutes % 60;
  return leftMinutes > 0 ? `${hours} sa ${leftMinutes} dk` : `${hours} sa`;
}

function trimText(value?: string): string {
  return value?.trim() || "";
}

function buildCalendarCells(monthDate: Date): CalendarCell[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const mondayBasedFirstDay = (firstDayOfMonth.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - mondayBasedFirstDay);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return {
      key: `${date.toISOString()}-${index}`,
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
    };
  });
}

export default function CustomerMeetingNotesSection({
  meetingNotes,
  isLoading,
  errorMessage,
  meetingRequests,
  isLoadingMeetingRequests,
  meetingRequestsErrorMessage,
  isCreatingMeetingRequest,
  meetingRequestErrorMessage,
  projects,
  selectedProjectId,
  onProjectChange,
  onCreateMeetingRequest,
}: CustomerMeetingNotesSectionProps) {
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [requestProjectId, setRequestProjectId] = useState("");
  const [requestPriority, setRequestPriority] = useState("MEDIUM");
  const [requestedDateTime, setRequestedDateTime] = useState("");
  const [requestedDuration, setRequestedDuration] = useState("");
  const [requestFormError, setRequestFormError] = useState<string | null>(null);
  const [requestFormSuccess, setRequestFormSuccess] = useState<string | null>(null);

  const meetingsByDate = useMemo(() => {
    const map = new Map<string, CustomerMeetingNote[]>();

    meetingNotes.forEach((item) => {
      const parsed = parseDate(item.date);
      if (!parsed) return;

      const key = toDateKey(parsed);
      const current = map.get(key) || [];
      current.push(item);
      map.set(key, current);
    });

    map.forEach((items, key) => {
      const sorted = [...items].sort(
        (a, b) => (parseDate(a.date)?.getTime() || 0) - (parseDate(b.date)?.getTime() || 0),
      );
      map.set(key, sorted);
    });

    return map;
  }, [meetingNotes]);

  const meetingRequestsByDate = useMemo(() => {
    const map = new Map<string, CustomerPanelTicket[]>();

    meetingRequests.forEach((item) => {
      const requestedDateRaw = extractRequestedDateTime(item.description);
      const parsed = parseDate(requestedDateRaw);
      if (!parsed) return;

      const key = toDateKey(parsed);
      const current = map.get(key) || [];
      current.push(item);
      map.set(key, current);
    });

    map.forEach((items, key) => {
      const sorted = [...items].sort(
        (a, b) => (parseDate(extractRequestedDateTime(a.description))?.getTime() || 0)
          - (parseDate(extractRequestedDateTime(b.description))?.getTime() || 0),
      );
      map.set(key, sorted);
    });

    return map;
  }, [meetingRequests]);

  const defaultSelectedDateKey = useMemo(() => {
    if (!meetingNotes.length) return "";
    const latest = [...meetingNotes].sort(
      (a, b) => (parseDate(b.date)?.getTime() || 0) - (parseDate(a.date)?.getTime() || 0),
    )[0];
    const parsed = parseDate(latest.date);
    return parsed ? toDateKey(parsed) : "";
  }, [meetingNotes]);

  const [selectedDateKey, setSelectedDateKey] = useState<string>(defaultSelectedDateKey);
  const effectiveSelectedDateKey = selectedDateKey || defaultSelectedDateKey;
  const selectedDayMeetings = meetingsByDate.get(effectiveSelectedDateKey) || [];
  const selectedDayMeetingRequests = meetingRequestsByDate.get(effectiveSelectedDateKey) || [];
  const calendarCells = useMemo(() => buildCalendarCells(calendarMonth), [calendarMonth]);

  const summarizedCount = meetingNotes.filter((item) => trimText(item.summary)).length;
  const linkedCount = meetingNotes.filter((item) => trimText(item.link)).length;
  const latestNoteDate = meetingNotes.length
    ? [...meetingNotes]
      .sort((a, b) => (parseDate(b.date)?.getTime() || 0) - (parseDate(a.date)?.getTime() || 0))[0]?.date
    : "";

  function goToPreviousMonth() {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  useEffect(() => {
    if (selectedProjectId) {
      setRequestProjectId(selectedProjectId);
    }
  }, [selectedProjectId]);

  async function handleSubmitMeetingRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestFormError(null);
    setRequestFormSuccess(null);

    if (!requestTitle.trim()) {
      setRequestFormError("Konu zorunludur.");
      return;
    }

    if (!requestedDateTime) {
      setRequestFormError("Tercih edilen tarih ve saat zorunludur.");
      return;
    }

    if (!requestDetails.trim()) {
      setRequestFormError("Gorusme amaci/aciklamasi zorunludur.");
      return;
    }

    const composedDescription = [
      `Gorusme talebi olusturuldu.`,
      `Tercih edilen tarih-saat: ${requestedDateTime}`,
      `Tahmini sure: ${requestedDuration || "30"} dk`,
      `Aciklama: ${requestDetails.trim()}`,
    ].join("\n");

    try {
      await onCreateMeetingRequest({
        subject: `Gorusme Talebi - ${requestTitle.trim()}`,
        description: composedDescription,
        priority: requestPriority,
        type: "OTHER",
        projectId: requestProjectId || undefined,
      });

      setRequestFormSuccess("Gorusme istegi basariyla olusturuldu.");
      setRequestTitle("");
      setRequestDetails("");
      setRequestedDateTime("");
      setRequestedDuration("30");
    } catch (error) {
      if (error instanceof Error && error.message) {
        setRequestFormError(error.message);
      } else {
        setRequestFormError("Gorusme istegi olusturulamadi.");
      }
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#111827]">Gorusme Notlari</h3>
            <p className="mt-1 text-sm text-slate-600">
              Toplanti kayitlari backend&apos;deki <code>GET /meetings</code> endpoint&apos;inden cekilir.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-5">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Toplam Kayit</p>
            <p className="mt-2 text-2xl font-semibold text-[#111827]">{meetingNotes.length}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Ozetli Toplanti</p>
            <p className="mt-2 text-2xl font-semibold text-[#111827]">{summarizedCount}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Linkli Kayit</p>
            <p className="mt-2 text-2xl font-semibold text-[#111827]">{linkedCount}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Gorusme Talebi</p>
            <p className="mt-2 text-2xl font-semibold text-[#111827]">{meetingRequests.length}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Son Toplanti</p>
            <p className="mt-2 text-sm font-semibold text-[#111827]">{formatDateTime(latestNoteDate)}</p>
          </article>
        </div>
      </section>

      {isLoading ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Gorusme notlari yukleniyor...
        </section>
      ) : errorMessage ? (
        <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {errorMessage}
        </section>
      ) : meetingNotes.length > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="space-y-4">
            {meetingNotes.map((item) => (
              <article key={item.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h4 className="text-base font-semibold text-[#111827]">{item.title || "Toplanti"}</h4>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {formatDateTime(item.date)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-md bg-slate-100 px-2 py-1">Sure: {formatDuration(item.durationMinutes)}</span>
                  <span className="rounded-md bg-slate-100 px-2 py-1">Proje ID: {item.projectId || "-"}</span>
                </div>

                {trimText(item.summary) && (
                  <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                    <strong>Ozet:</strong> {item.summary}
                  </p>
                )}

                {trimText(item.notes) ? (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{item.notes}</p>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">Bu kayit icin not metni eklenmemis.</p>
                )}

                {trimText(item.link) && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-sm font-semibold text-slate-900 underline underline-offset-2"
                  >
                    Toplanti baglantisini ac
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h4 className="text-base font-semibold text-[#111827]">Gorusme istegi olustur</h4>
          <p className="mt-2 text-sm text-slate-600">
            Bu alandan dogrudan gorusme istegi acabilirsiniz.
          </p>

          <form className="mt-4 space-y-3" onSubmit={handleSubmitMeetingRequest}>
            <input
              value={requestTitle}
              onChange={(event) => setRequestTitle(event.target.value)}
              placeholder="Gorusme konusu"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-900"
            />

            <textarea
              value={requestDetails}
              onChange={(event) => setRequestDetails(event.target.value)}
              placeholder="Gorusme amaci ve beklentiniz"
              className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-900"
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <select
                value={requestProjectId}
                onChange={(event) => setRequestProjectId(event.target.value)}
                className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-900"
              >
                <option value="">Proje secin (opsiyonel)</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <select
                value={requestPriority}
                onChange={(event) => setRequestPriority(event.target.value)}
                className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-900"
              >
                <option value="LOW">Dusuk</option>
                <option value="MEDIUM">Orta</option>
                <option value="HIGH">Yuksek</option>
                <option value="URGENT">Acil</option>
              </select>

              <input
                type="datetime-local"
                value={requestedDateTime}
                onChange={(event) => setRequestedDateTime(event.target.value)}
                className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-900"
              />

              <input
                type="number"
                min={15}
                max={60}
                step={15}
                value={requestedDuration}
                onChange={(event) => setRequestedDuration(event.target.value)}
                placeholder="Sure (dk)"
                className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-900"
              />
            </div>

            {(requestFormError || meetingRequestErrorMessage) && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {requestFormError || meetingRequestErrorMessage}
              </p>
            )}

            {requestFormSuccess && (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                {requestFormSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={isCreatingMeetingRequest}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreatingMeetingRequest ? "GONDERILIYOR..." : "GORUSME ISTEGI OLUSTUR"}
            </button>
          </form>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-3">
            <h4 className="text-base font-semibold text-[#111827] md:justify-self-start">Gorusme Takvimi</h4>

            <div className="w-full md:max-w-xs md:justify-self-center">
              <select
                id="meeting-project-filter"
                value={selectedProjectId}
                onChange={(event) => onProjectChange(event.target.value)}
                className="h-10 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-[#111827]"
              >
                <option value="">Tum projeler</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 md:justify-self-end">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
                aria-label="Onceki ay"
              >
                {"<"}
              </button>
              <button
                type="button"
                onClick={goToNextMonth}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
                aria-label="Sonraki ay"
              >
                {">"}
              </button>
            </div>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-700">
            {MONTH_LABELS[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
          </p>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-slate-500">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="py-1 font-semibold uppercase tracking-wide">
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell) => {
              const dateKey = toDateKey(cell.date);
              const dayMeetings = meetingsByDate.get(dateKey) || [];
              const dayRequests = meetingRequestsByDate.get(dateKey) || [];
              const count = dayMeetings.length + dayRequests.length;
              const isSelected = effectiveSelectedDateKey === dateKey;

              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => setSelectedDateKey(dateKey)}
                  className={`group relative h-12 rounded-md border text-xs transition ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white"
                      : cell.isCurrentMonth
                        ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        : "border-slate-100 bg-slate-50 text-slate-400"
                  }`}
                  title={count > 0 ? `${count} gorusme` : undefined}
                >
                  <span className="absolute left-2 top-1.5">{cell.day}</span>
                  {count > 0 && (
                    <span
                      className={`absolute bottom-1 right-1 inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                        isSelected ? "bg-white text-slate-900" : "bg-slate-900 text-white"
                      }`}
                    >
                      {count}
                    </span>
                  )}

                  {count > 0 && (
                    <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-1 hidden w-56 -translate-x-1/2 rounded-md border border-slate-200 bg-white p-2 text-left shadow-xl group-hover:block">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Gunun Gorusmeleri
                      </p>
                      <ul className="space-y-1">
                        {dayMeetings.slice(0, 3).map((meeting) => (
                          <li key={`hover-${meeting.id}`} className="rounded border border-slate-100 bg-slate-50 px-2 py-1">
                            <p className="m-0 truncate text-[11px] font-semibold text-slate-800">
                              {meeting.title || "Toplanti"}
                            </p>
                            <p className="m-0 mt-0.5 text-[10px] text-slate-600">
                              {formatTime(meeting.date)} | {formatDuration(meeting.durationMinutes)}
                            </p>
                            {(meeting.summary || meeting.notes) && (
                              <p className="m-0 mt-0.5 max-h-8 overflow-hidden text-[10px] text-slate-500">
                                {String(meeting.summary || meeting.notes).slice(0, 100)}
                              </p>
                            )}
                          </li>
                        ))}
                        {dayRequests.slice(0, 2).map((request) => (
                          <li key={`hover-request-${request.id}`} className="rounded border border-indigo-100 bg-indigo-50 px-2 py-1">
                            <p className="m-0 truncate text-[11px] font-semibold text-indigo-800">
                              Talep: {request.subject || "Gorusme Talebi"}
                            </p>
                            <p className="m-0 mt-0.5 text-[10px] text-indigo-700">
                              {extractRequestedDateTime(request.description) || "-"} | {extractRequestedDuration(request.description)}
                            </p>
                            <p className="m-0 mt-0.5 text-[10px] text-indigo-600">
                              {mapRequestStatus(request)}
                            </p>
                          </li>
                        ))}
                      </ul>
                      {count > 5 && (
                        <p className="mt-1 text-[10px] font-medium text-slate-500">
                          +{count - 5} kayit daha
                        </p>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Secili Gun Toplantilari
            </p>

            {selectedDayMeetings.length === 0 && selectedDayMeetingRequests.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">Bu gunde planli gorusme yok.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {selectedDayMeetings.map((meeting) => (
                  <li key={`calendar-${meeting.id}`} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-sm font-semibold text-slate-800">{meeting.title || "Toplanti"}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      Saat: {formatDateTime(meeting.date)} | Sure: {formatDuration(meeting.durationMinutes)}
                    </p>
                  </li>
                ))}
                {selectedDayMeetingRequests.map((request) => (
                  <li key={`calendar-request-${request.id}`} className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2">
                    <p className="text-sm font-semibold text-indigo-900">
                      Talep: {request.subject || "Gorusme Talebi"}
                    </p>
                    <p className="mt-1 text-xs text-indigo-700">
                      Tercih: {extractRequestedDateTime(request.description) || "-"} | Sure: {extractRequestedDuration(request.description)}
                    </p>
                    <p className="mt-1 text-xs text-indigo-600">
                      Durum: {mapRequestStatus(request)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Gorusme Talepleri
            </p>

            {isLoadingMeetingRequests ? (
              <p className="mt-2 text-sm text-slate-600">Gorusme talepleri yukleniyor...</p>
            ) : meetingRequestsErrorMessage ? (
              <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">
                {meetingRequestsErrorMessage}
              </p>
            ) : meetingRequests.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">Henuz gorusme talebi bulunmuyor.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {meetingRequests
                  .slice()
                  .sort((a, b) => (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0))
                  .map((request) => (
                    <li key={`meeting-request-${request.id}`} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-sm font-semibold text-slate-800">{request.subject || "Gorusme Talebi"}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        Tercih: {extractRequestedDateTime(request.description) || "-"} | Sure: {extractRequestedDuration(request.description)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Durum: {mapRequestStatus(request)} {request.stage ? `| Asama: ${request.stage}` : ""}
                      </p>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
