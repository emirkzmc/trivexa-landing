import type {
  CreateCustomerTicketInput,
  CustomerMeetingNote,
  CustomerPanelDashboardData,
  CustomerPanelPath,
  CustomerPanelProject,
  CustomerPanelTicket,
} from "../model/types";
import CustomerMeetingNotesSection from "./CustomerMeetingNotesSection";
import CustomerRequestsSection from "./CustomerRequestsSection";
import DashboardStats from "./DashboardStats";
import PendingApprovalsSection from "./PendingApprovalsSection";
import TableCard from "./TableCard";

interface CustomerPanelContentProps {
  currentPath: CustomerPanelPath;
  dashboardData: CustomerPanelDashboardData | null;
  isLoading: boolean;
  errorMessage: string | null;
  tickets: CustomerPanelTicket[];
  isLoadingTickets: boolean;
  isCreatingTicket: boolean;
  ticketErrorMessage: string | null;
  meetingNotes: CustomerMeetingNote[];
  isLoadingMeetingNotes: boolean;
  meetingNotesErrorMessage: string | null;
  isLoadingMeetingRequests: boolean;
  meetingRequestsErrorMessage: string | null;
  isCreatingMeetingRequest: boolean;
  meetingRequestErrorMessage: string | null;
  selectedMeetingProjectId: string;
  projects: CustomerPanelProject[];
  onMeetingProjectChange: (projectId: string) => void;
  onCreateMeetingRequest: (input: CreateCustomerTicketInput) => Promise<void>;
  onCreateTicket: (input: CreateCustomerTicketInput) => Promise<void>;
}

function normalizeForMeetingMatch(value: string): string {
  return (value || "")
    .toLowerCase()
    .replace(/\u011f/g, "g")
    .replace(/\u00fc/g, "u")
    .replace(/\u015f/g, "s")
    .replace(/\u0131/g, "i")
    .replace(/\u00f6/g, "o")
    .replace(/\u00e7/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isMeetingRequest(subject: string, type: string): boolean {
  if ((type || "").toUpperCase() !== "OTHER") return false;
  return normalizeForMeetingMatch(subject).startsWith("gorusme talebi");
}

export default function CustomerPanelContent({
  currentPath,
  dashboardData,
  isLoading,
  errorMessage,
  tickets,
  isLoadingTickets,
  isCreatingTicket,
  ticketErrorMessage,
  meetingNotes,
  isLoadingMeetingNotes,
  meetingNotesErrorMessage,
  isLoadingMeetingRequests,
  meetingRequestsErrorMessage,
  isCreatingMeetingRequest,
  meetingRequestErrorMessage,
  selectedMeetingProjectId,
  projects,
  onMeetingProjectChange,
  onCreateMeetingRequest,
  onCreateTicket,
}: CustomerPanelContentProps) {
  const supportTickets = tickets.filter((item) => !isMeetingRequest(item.subject, item.type));
  const meetingRequestTickets = tickets.filter((item) => isMeetingRequest(item.subject, item.type));

  if (isLoading && !dashboardData) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Panel verileri yukleniyor...
      </section>
    );
  }

  if (errorMessage && !dashboardData) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {errorMessage}
      </section>
    );
  }

  if (currentPath === "/customer-panel/dashboard") {
    return <DashboardStats dashboardData={dashboardData} />;
  }

  if (currentPath === "/customer-panel/projeler") {
    const rows = dashboardData?.projects.length
      ? dashboardData.projects.map((item) => [item.name, item.progress, item.status])
      : [["-", "Backend'de proje bulunmuyor", "-"]];

    return (
      <TableCard
        title="Projelerim"
        columns={["Proje", "Ilerleme", "Durum"]}
        rows={rows}
      />
    );
  }

  if (currentPath === "/customer-panel/talepler") {
    return (
      <CustomerRequestsSection
        tickets={supportTickets}
        isLoading={isLoadingTickets}
        isCreating={isCreatingTicket}
        errorMessage={ticketErrorMessage}
        projects={projects}
        onCreateTicket={onCreateTicket}
      />
    );
  }

  if (currentPath === "/customer-panel/onaylar") {
    return (
      <PendingApprovalsSection
        pendingInvoices={dashboardData?.pendingInvoices ?? 0}
        requests={supportTickets}
        isLoading={isLoadingTickets}
        errorMessage={ticketErrorMessage}
      />
    );
  }

  if (currentPath === "/customer-panel/notlar") {
    return (
      <CustomerMeetingNotesSection
        meetingNotes={meetingNotes}
        isLoading={isLoadingMeetingNotes}
        errorMessage={meetingNotesErrorMessage}
        meetingRequests={meetingRequestTickets}
        isLoadingMeetingRequests={isLoadingMeetingRequests}
        meetingRequestsErrorMessage={meetingRequestsErrorMessage}
        isCreatingMeetingRequest={isCreatingMeetingRequest}
        meetingRequestErrorMessage={meetingRequestErrorMessage}
        projects={projects}
        selectedProjectId={selectedMeetingProjectId}
        onProjectChange={onMeetingProjectChange}
        onCreateMeetingRequest={onCreateMeetingRequest}
      />
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
      Icerik bulunamadi.
    </section>
  );
}

