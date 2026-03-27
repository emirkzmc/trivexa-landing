import { useMemo } from "react";
import type {
  CreateCustomerTicketInput,
  CustomerMeetingNote,
  CustomerPanelProject,
  CustomerPanelTicket,
} from "../model/types";
import SectionHeader from "../../../shared/ui/SectionHeader";
import StatCard from "../../../shared/ui/StatCard";
import Surface from "../../../shared/ui/Surface";
import MeetingCalendarPanel from "./meeting/MeetingCalendarPanel";
import MeetingNotesList from "./meeting/MeetingNotesList";
import MeetingRequestForm from "./meeting/MeetingRequestForm";
import { formatDateTime, parseDate, trimText } from "./meeting/meetingUtils";

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
  const summarizedCount = useMemo(
    () => meetingNotes.filter((item) => trimText(item.summary)).length,
    [meetingNotes],
  );
  const linkedCount = useMemo(
    () => meetingNotes.filter((item) => trimText(item.link)).length,
    [meetingNotes],
  );
  const latestNoteDate = useMemo(() => {
    if (!meetingNotes.length) return "";
    const sorted = [...meetingNotes].sort(
      (a, b) => (parseDate(b.date)?.getTime() || 0) - (parseDate(a.date)?.getTime() || 0),
    );
    return sorted[0]?.date || "";
  }, [meetingNotes]);

  return (
    <div className="space-y-4">
      <Surface className="p-5">
        <SectionHeader
          title="Gorusme Notlari"
          description="Toplanti kayitlari backend'deki GET /meetings endpoint'inden cekilir."
        />

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-5">
          <StatCard label="Toplam Kayit" value={meetingNotes.length} />
          <StatCard label="Ozetli Toplanti" value={summarizedCount} />
          <StatCard label="Linkli Kayit" value={linkedCount} />
          <StatCard label="Gorusme Talebi" value={meetingRequests.length} />
          <StatCard
            label="Son Toplanti"
            value={formatDateTime(latestNoteDate)}
            valueClassName="text-sm font-semibold text-[#111827]"
          />
        </div>
      </Surface>

      <MeetingNotesList meetingNotes={meetingNotes} isLoading={isLoading} errorMessage={errorMessage} />

      <section className="grid gap-4 lg:grid-cols-2">
        <MeetingRequestForm
          projects={projects}
          selectedProjectId={selectedProjectId}
          isCreating={isCreatingMeetingRequest}
          errorMessage={meetingRequestErrorMessage}
          onCreateMeetingRequest={onCreateMeetingRequest}
        />

        <MeetingCalendarPanel
          meetingNotes={meetingNotes}
          meetingRequests={meetingRequests}
          isLoadingMeetingRequests={isLoadingMeetingRequests}
          meetingRequestsErrorMessage={meetingRequestsErrorMessage}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectChange={onProjectChange}
        />
      </section>
    </div>
  );
}
