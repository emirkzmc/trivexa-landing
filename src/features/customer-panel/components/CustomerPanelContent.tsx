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
import CustomerMeetingNotesSection from "./CustomerMeetingNotesSection";
import CustomerRequestsSection from "./CustomerRequestsSection";
import DashboardStats from "./DashboardStats";
import PendingApprovalsSection from "./PendingApprovalsSection";

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

function formatDate(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("tr-TR");
}

function formatValue(value?: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `${value.toLocaleString("tr-TR")} TL`;
}

function mapContractStatus(status: string): string {
  const normalized = (status || "").toUpperCase();
  const labels: Record<string, string> = {
    DRAFT: "Taslak",
    PENDING_APPROVAL: "Onay Bekliyor",
    APPROVED: "Onaylandi",
    SIGNED: "Imzalandi",
    EXPIRED: "Suresi Doldu",
    TERMINATED: "Feshedildi",
  };
  return labels[normalized] || normalized || "-";
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
    const rows = dashboardData?.projects ?? [];

    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-900">Projelerim</h3>
        <p className="mt-2 text-sm text-slate-600">
          Projelere tiklayarak detaylarini goruntuleyebilirsiniz.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-2 py-3 font-semibold">Proje</th>
                <th className="px-2 py-3 font-semibold">Ilerleme</th>
                <th className="px-2 py-3 font-semibold">Durum</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-2 py-6 text-center text-sm text-slate-500">
                    Backend'de proje bulunmuyor.
                  </td>
                </tr>
              ) : (
                rows.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => onNavigate(`${CUSTOMER_PANEL_PROJECT_DETAIL_PREFIX}${project.id}`)}
                    className="cursor-pointer border-b border-slate-100 text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-2 py-3 font-semibold text-slate-900">{project.name}</td>
                    <td className="px-2 py-3">{project.progress}</td>
                    <td className="px-2 py-3">{project.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
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
      return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Sozlesme detayi yukleniyor...
        </section>
      );
    }

    if (contractDetailError) {
      return (
        <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {contractDetailError}
        </section>
      );
    }

    if (!detail) {
      return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Sozlesme bulunamadi.
        </section>
      );
    }

    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <button
          type="button"
          onClick={() => onNavigate("/customer-panel/sozlesmeler")}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700"
        >
          &larr; Sozlesmelere Don
        </button>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{detail.title || "-"}</h3>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {mapContractStatus(detail.status)}
          </span>
        </div>

        {detail.description && (
          <p className="mt-2 text-sm text-slate-600">{detail.description}</p>
        )}

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Baslangic</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{formatDate(detail.startDate)}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Bitis</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{formatDate(detail.endDate)}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Tutar</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{formatValue(detail.value)}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Imzali Dosya</p>
            {detail.signedUrl ? (
              <a
                href={detail.signedUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-sm font-semibold text-slate-700 underline hover:text-slate-900"
              >
                Goruntule
              </a>
            ) : (
              <p className="mt-2 text-sm font-semibold text-slate-900">-</p>
            )}
          </article>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Olusturma</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{formatDate(detail.createdAt)}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Guncellenme</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{formatDate(detail.updatedAt)}</p>
          </article>
        </section>
      </section>
    );
  }

  if (currentPath.startsWith(CUSTOMER_PANEL_PROJECT_DETAIL_PREFIX)) {
    const projectId = currentPath.replace(CUSTOMER_PANEL_PROJECT_DETAIL_PREFIX, "");
    const detail = projectDetail?.project?.id === projectId ? projectDetail : null;

    if (isLoadingProjectDetail) {
      return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Proje detayi yukleniyor...
        </section>
      );
    }

    if (projectDetailError) {
      return (
        <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {projectDetailError}
        </section>
      );
    }

    if (!detail) {
      return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Proje bulunamadi.
        </section>
      );
    }

    const { project, taskMetrics, taskSummary, recentTasks } = detail;
    const progressValue = (() => {
      if (typeof taskMetrics?.percentage === "number" && Number.isFinite(taskMetrics.percentage)) {
        return Math.round(taskMetrics.percentage);
      }
      const summaryTotal = taskSummary?.total ?? 0;
      if (summaryTotal > 0) {
        return Math.round(((taskSummary?.byStatus?.DONE ?? 0) / summaryTotal) * 100);
      }
      return 0;
    })();

    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <button
          type="button"
          onClick={() => onNavigate("/customer-panel/projeler")}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700"
        >
          &larr; Projelere Don
        </button>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {project.status}
          </span>
        </div>

        {project.description && (
          <p className="mt-2 text-sm text-slate-600">{project.description}</p>
        )}

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Baslangic</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{project.startDate || "-"}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Teslim</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{project.deadline || "-"}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Butce</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {typeof project.budget === "number" ? `${project.budget.toLocaleString("tr-TR")} TL` : "-"}
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Ilerleme</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">%{progressValue}</p>
          </article>
        </section>

        <section className="mt-5 grid gap-3 lg:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-semibold text-slate-900">Gorev Ozeti</h4>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                Toplam: <strong>{taskSummary?.total ?? taskMetrics?.total ?? 0}</strong>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                Tamamlanan: <strong>{taskMetrics?.completed ?? taskSummary?.byStatus?.DONE ?? 0}</strong>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                Devam Eden: <strong>{taskSummary?.byStatus?.IN_PROGRESS ?? 0}</strong>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                Bu Hafta Biten: <strong>{taskSummary?.doneThisWeek ?? 0}</strong>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-semibold text-slate-900">Durum Dagilimi</h4>
            <div className="mt-3 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span>Todo</span>
                <strong>{taskSummary?.byStatus?.TODO ?? 0}</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span>In Progress</span>
                <strong>{taskSummary?.byStatus?.IN_PROGRESS ?? 0}</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span>In Review</span>
                <strong>{taskSummary?.byStatus?.IN_REVIEW ?? 0}</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span>Blocked</span>
                <strong>{taskSummary?.byStatus?.BLOCKED ?? 0}</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span>Done</span>
                <strong>{taskSummary?.byStatus?.DONE ?? 0}</strong>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="text-sm font-semibold text-slate-900">Son Gorevler</h4>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-2 py-2 font-semibold">Gorev</th>
                  <th className="px-2 py-2 font-semibold">Durum</th>
                  <th className="px-2 py-2 font-semibold">Oncelik</th>
                  <th className="px-2 py-2 font-semibold">Sorumlu</th>
                </tr>
              </thead>
              <tbody>
                {!recentTasks || recentTasks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-2 py-4 text-center text-xs text-slate-500">
                      Gosterilecek gorev bulunamadi.
                    </td>
                  </tr>
                ) : (
                  recentTasks.map((task) => (
                    <tr key={task.id} className="border-b border-slate-100 text-slate-700">
                      <td className="px-2 py-2 font-medium text-slate-900">{task.title}</td>
                      <td className="px-2 py-2">{task.status}</td>
                      <td className="px-2 py-2">{task.priority || "-"}</td>
                      <td className="px-2 py-2">{task.assigneeName || task.assigneeEmail || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
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


