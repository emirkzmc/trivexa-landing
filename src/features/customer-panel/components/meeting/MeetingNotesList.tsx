import type { CustomerMeetingNote } from "../../model/types";
import InfoMessage from "../../../../shared/ui/InfoMessage";
import PillBadge from "../../../../shared/ui/PillBadge";
import Surface from "../../../../shared/ui/Surface";
import { formatDateTime, formatDuration, trimText } from "./meetingUtils";

interface MeetingNotesListProps {
  meetingNotes: CustomerMeetingNote[];
  isLoading: boolean;
  errorMessage: string | null;
}

export default function MeetingNotesList({
  meetingNotes,
  isLoading,
  errorMessage,
}: MeetingNotesListProps) {
  if (isLoading) {
    return <InfoMessage message="Gorusme notlari yukleniyor..." />;
  }

  if (errorMessage) {
    return <InfoMessage message={errorMessage} tone="error" />;
  }

  if (meetingNotes.length === 0) {
    return null;
  }

  return (
    <Surface className="p-5">
      <div className="space-y-4">
        {meetingNotes.map((item) => (
          <Surface key={item.id} as="article" className="rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h4 className="text-base font-semibold text-[#111827]">{item.title || "Toplanti"}</h4>
              <PillBadge>{formatDateTime(item.date)}</PillBadge>
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
          </Surface>
        ))}
      </div>
    </Surface>
  );
}
