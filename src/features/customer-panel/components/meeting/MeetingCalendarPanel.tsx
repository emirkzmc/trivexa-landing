import { useMemo, useState } from "react";
import type { CustomerMeetingNote, CustomerPanelProject, CustomerPanelTicket } from "../../model/types";
import Surface from "../../../../shared/ui/Surface";
import {
  MONTH_LABELS,
  WEEKDAY_LABELS,
  buildCalendarCells,
  extractRequestedDateTime,
  extractRequestedDuration,
  formatDateTime,
  formatDuration,
  formatTime,
  mapRequestStatus,
  parseDate,
  toDateKey,
} from "./meetingUtils";

interface MeetingCalendarPanelProps {
  meetingNotes: CustomerMeetingNote[];
  meetingRequests: CustomerPanelTicket[];
  isLoadingMeetingRequests: boolean;
  meetingRequestsErrorMessage: string | null;
  projects: CustomerPanelProject[];
  selectedProjectId: string;
  onProjectChange: (projectId: string) => void;
}

export default function MeetingCalendarPanel({
  meetingNotes,
  meetingRequests,
  isLoadingMeetingRequests,
  meetingRequestsErrorMessage,
  projects,
  selectedProjectId,
  onProjectChange,
}: MeetingCalendarPanelProps) {
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

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

  function goToPreviousMonth() {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  return (
    <Surface as="article" className="p-5">
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
    </Surface>
  );
}
