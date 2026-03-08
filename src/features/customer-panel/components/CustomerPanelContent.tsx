import type {
  CreateCustomerTicketInput,
  CustomerPanelDashboardData,
  CustomerPanelPath,
  CustomerPanelProject,
  CustomerPanelTicket,
} from "../model/types";
import CustomerRequestsSection from "./CustomerRequestsSection";
import DashboardStats from "./DashboardStats";
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
  projects: CustomerPanelProject[];
  onCreateTicket: (input: CreateCustomerTicketInput) => Promise<void>;
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
  projects,
  onCreateTicket,
}: CustomerPanelContentProps) {
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
        tickets={tickets}
        isLoading={isLoadingTickets}
        isCreating={isCreatingTicket}
        errorMessage={ticketErrorMessage}
        projects={projects}
        onCreateTicket={onCreateTicket}
      />
    );
  }

  if (currentPath === "/customer-panel/notlar") {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Gorusme Notlari icin musteri portali endpoint'i henuz tanimli degil.
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
      Onay Bekleyen icin musteri portali endpoint'i henuz tanimli degil.
    </section>
  );
}
