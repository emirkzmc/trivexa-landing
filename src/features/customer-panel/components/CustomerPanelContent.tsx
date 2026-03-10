import type {
  CreateCustomerTicketInput,
  CustomerMeetingNote,
  CustomerPanelContract,
  CustomerPanelDashboardData,
  CustomerPanelProjectDetail,
  CustomerPanelPath,
  CustomerPanelProject,
  CustomerPanelTicket,
} from "../model/types";
import { CUSTOMER_PANEL_CONTRACT_DETAIL_PREFIX, CUSTOMER_PANEL_PROJECT_DETAIL_PREFIX } from "../model/types";
import CustomerContractsSection from "./CustomerContractsSection";
import CustomerContractDetailSection from "./CustomerContractDetailSection";
import CustomerMeetingNotesSection from "./CustomerMeetingNotesSection";
import CustomerRequestsSection from "./CustomerRequestsSection";
import CustomerProjectDetailSection from "./CustomerProjectDetailSection";
import CustomerProjectListSection from "./CustomerProjectListSection";
import DashboardStats from "./DashboardStats";
import PendingApprovalsSection from "./PendingApprovalsSection";
import InfoMessage from "../../../shared/ui/InfoMessage";

interface CustomerPanelContentProps {
  currentPath: CustomerPanelPath;
  dashboardData: CustomerPanelDashboardData | null;
  isLoading: boolean;
  errorMessage: string | null;
  projectDetail: CustomerPanelProjectDetail | null;
  isLoadingProjectDetail: boolean;
  projectDetailError: string | null;
  contracts: CustomerPanelContract[];
  isLoadingContracts: boolean;
  contractsErrorMessage: string | null;
  contractDetail: CustomerPanelContract | null;
  isLoadingContractDetail: boolean;
  contractDetailError: string | null;
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
  onNavigate: (path: CustomerPanelPath) => void;
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
  projectDetail,
  isLoadingProjectDetail,
  projectDetailError,
  contracts,
  isLoadingContracts,
  contractsErrorMessage,
  contractDetail,
  isLoadingContractDetail,
  contractDetailError,
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
  onNavigate,
}: CustomerPanelContentProps) {
  const supportTickets = tickets.filter((item) => !isMeetingRequest(item.subject, item.type));
  const meetingRequestTickets = tickets.filter((item) => isMeetingRequest(item.subject, item.type));

  if (isLoading && !dashboardData) {
    return <InfoMessage message="Panel verileri yukleniyor..." />;
  }

  if (errorMessage && !dashboardData) {
    return <InfoMessage message={errorMessage} tone="error" />;
  }

  if (currentPath === "/customer-panel/dashboard") {
    return <DashboardStats dashboardData={dashboardData} />;
  }

  if (currentPath === "/customer-panel/projeler") {
    return (
      <CustomerProjectListSection
        projects={dashboardData?.projects ?? []}
        onSelectProject={(projectId) =>
          onNavigate(`${CUSTOMER_PANEL_PROJECT_DETAIL_PREFIX}${projectId}`)
        }
      />
    );
  }

  if (currentPath === "/customer-panel/sozlesmeler") {
    return (
      <CustomerContractsSection
        contracts={contracts}
        isLoading={isLoadingContracts}
        errorMessage={contractsErrorMessage}
        onSelectContract={(contractId) =>
          onNavigate(`${CUSTOMER_PANEL_CONTRACT_DETAIL_PREFIX}${contractId}`)
        }
      />
    );
  }

  if (currentPath.startsWith(CUSTOMER_PANEL_CONTRACT_DETAIL_PREFIX)) {
    const contractId = currentPath.replace(CUSTOMER_PANEL_CONTRACT_DETAIL_PREFIX, "");
    const detail = contractDetail?.id === contractId ? contractDetail : null;

    if (isLoadingContractDetail) {
      return <InfoMessage message="Sozlesme detayi yukleniyor..." />;
    }

    if (contractDetailError) {
      return <InfoMessage message={contractDetailError} tone="error" />;
    }

    if (!detail) {
      return <InfoMessage message="Sozlesme bulunamadi." />;
    }

    return (
      <CustomerContractDetailSection
        contract={detail}
        onBack={() => onNavigate("/customer-panel/sozlesmeler")}
      />
    );
  }

  if (currentPath.startsWith(CUSTOMER_PANEL_PROJECT_DETAIL_PREFIX)) {
    const projectId = currentPath.replace(CUSTOMER_PANEL_PROJECT_DETAIL_PREFIX, "");
    const detail = projectDetail?.project?.id === projectId ? projectDetail : null;

    if (isLoadingProjectDetail) {
      return <InfoMessage message="Proje detayi yukleniyor..." />;
    }

    if (projectDetailError) {
      return <InfoMessage message={projectDetailError} tone="error" />;
    }

    if (!detail) {
      return <InfoMessage message="Proje bulunamadi." />;
    }

    return (
      <CustomerProjectDetailSection
        detail={detail}
        onBack={() => onNavigate("/customer-panel/projeler")}
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

  return <InfoMessage message="Icerik bulunamadi." />;
}


