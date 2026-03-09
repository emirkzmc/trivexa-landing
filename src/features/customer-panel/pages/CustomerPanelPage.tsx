import { useCallback, useEffect, useMemo, useState } from "react";
import CustomerPanelContent from "../components/CustomerPanelContent";
import CustomerPanelHeader from "../components/CustomerPanelHeader";
import CustomerPanelSidebar from "../components/CustomerPanelSidebar";
import { MOBILE_BREAKPOINT, PAGE_NAMES } from "../model/constants";
import {
  ApiHttpError,
  createCustomerTicket,
  getCustomerDashboard,
  getCustomerMeetingNotes,
  getCustomerTickets,
} from "../model/api";
import {
  type CreateCustomerTicketInput,
  CUSTOMER_PANEL_PATHS,
  type CustomerMeetingNote,
  type CustomerPanelDashboardData,
  type CustomerPanelPath,
  type CustomerPanelSession,
  type CustomerPanelTicket,
} from "../model/types";

export { CUSTOMER_PANEL_DEFAULT_PATH } from "../model/constants";
export type { CustomerPanelPath } from "../model/types";

interface CustomerPanelPageProps {
  currentPath: CustomerPanelPath;
  onNavigate: (path: CustomerPanelPath) => void;
  session: CustomerPanelSession | null;
  onLogout: () => void;
  onRequireLogin: () => void;
}

export function isCustomerPanelPath(pathname: string): pathname is CustomerPanelPath {
  return CUSTOMER_PANEL_PATHS.includes(pathname as CustomerPanelPath);
}

export default function CustomerPanelPage({
  currentPath,
  onNavigate,
  session,
  onLogout,
  onRequireLogin,
}: CustomerPanelPageProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<CustomerPanelDashboardData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [tickets, setTickets] = useState<CustomerPanelTicket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketErrorMessage, setTicketErrorMessage] = useState<string | null>(null);
  const [isCreatingMeetingRequest, setIsCreatingMeetingRequest] = useState(false);
  const [meetingRequestErrorMessage, setMeetingRequestErrorMessage] = useState<string | null>(null);

  const [meetingNotes, setMeetingNotes] = useState<CustomerMeetingNote[]>([]);
  const [isLoadingMeetingNotes, setIsLoadingMeetingNotes] = useState(false);
  const [meetingNotesErrorMessage, setMeetingNotesErrorMessage] = useState<string | null>(null);
  const [selectedMeetingProjectId, setSelectedMeetingProjectId] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const nextMobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(nextMobile);
      if (!nextMobile) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const activeSession = session;

    if (!activeSession) {
      onRequireLogin();
      return;
    }

    const accessToken = activeSession.accessToken;
    let isActive = true;

    async function fetchDashboardData() {
      setIsLoadingData(true);
      setErrorMessage(null);

      try {
        const response = await getCustomerDashboard(accessToken);
        if (isActive) {
          setDashboardData(response);
        }
      } catch (error) {
        if (!isActive) return;

        if (error instanceof ApiHttpError && error.status === 401) {
          onLogout();
          return;
        }

        if (error instanceof Error && error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Panel verileri alinirken bir hata olustu.");
        }
      } finally {
        if (isActive) {
          setIsLoadingData(false);
        }
      }
    }

    void fetchDashboardData();

    return () => {
      isActive = false;
    };
  }, [onLogout, onRequireLogin, session]);

  const fetchTickets = useCallback(async () => {
    if (!session) return;

    setIsLoadingTickets(true);
    setTicketErrorMessage(null);

    try {
      const items = await getCustomerTickets(session.accessToken);
      setTickets(items);
    } catch (error) {
      if (error instanceof ApiHttpError && error.status === 401) {
        onLogout();
        return;
      }

      if (error instanceof Error && error.message) {
        setTicketErrorMessage(error.message);
      } else {
        setTicketErrorMessage("Talepler alinirken bir hata olustu.");
      }
    } finally {
      setIsLoadingTickets(false);
    }
  }, [onLogout, session]);

  useEffect(() => {
    if (
      currentPath !== "/customer-panel/talepler"
      && currentPath !== "/customer-panel/onaylar"
      && currentPath !== "/customer-panel/notlar"
    ) {
      return;
    }
    void fetchTickets();
  }, [currentPath, fetchTickets]);

  const fetchMeetingNotes = useCallback(async (options?: { silent?: boolean }) => {
    if (!session) return;

    const resolvedClientId = dashboardData?.clientId || session.userId;

    if (!options?.silent) {
      setIsLoadingMeetingNotes(true);
      setMeetingNotesErrorMessage(null);
    }

    try {
      const items = await getCustomerMeetingNotes(session.accessToken, {
        clientId: resolvedClientId || undefined,
        projectId: selectedMeetingProjectId || undefined,
      });
      setMeetingNotes(items);
    } catch (error) {
      if (error instanceof ApiHttpError && error.status === 401) {
        onLogout();
        return;
      }

      if (error instanceof Error && error.message) {
        setMeetingNotesErrorMessage(error.message);
      } else {
        setMeetingNotesErrorMessage("Gorusme notlari alinirken bir hata olustu.");
      }
    } finally {
      if (!options?.silent) {
        setIsLoadingMeetingNotes(false);
      }
    }
  }, [dashboardData?.clientId, onLogout, selectedMeetingProjectId, session]);

  useEffect(() => {
    if (currentPath !== "/customer-panel/notlar") {
      return;
    }
    void fetchMeetingNotes();
  }, [currentPath, fetchMeetingNotes]);

  useEffect(() => {
    if (currentPath !== "/customer-panel/notlar") {
      return;
    }

    const intervalId = window.setInterval(() => {
      void fetchMeetingNotes({ silent: true });
    }, 20_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [currentPath, fetchMeetingNotes]);

  const handleCreateTicket = useCallback(
    async (input: CreateCustomerTicketInput) => {
      if (!session) {
        onRequireLogin();
        throw new Error("Oturum bulunamadi.");
      }

      setIsCreatingTicket(true);
      setTicketErrorMessage(null);

      try {
        const created = await createCustomerTicket(session.accessToken, input);
        setTickets((prev) => [created, ...prev]);
      } catch (error) {
        if (error instanceof ApiHttpError && error.status === 401) {
          onLogout();
          throw error;
        }

        if (error instanceof Error && error.message) {
          setTicketErrorMessage(error.message);
        } else {
          setTicketErrorMessage("Talep olusturulamadi.");
        }
        throw error;
      } finally {
        setIsCreatingTicket(false);
      }
    },
    [onLogout, onRequireLogin, session],
  );

  const handleCreateMeetingRequest = useCallback(
    async (input: CreateCustomerTicketInput) => {
      if (!session) {
        onRequireLogin();
        throw new Error("Oturum bulunamadi.");
      }

      setIsCreatingMeetingRequest(true);
      setMeetingRequestErrorMessage(null);

      try {
        const created = await createCustomerTicket(session.accessToken, {
          ...input,
          type: "OTHER",
        });
        setTickets((prev) => [created, ...prev]);
      } catch (error) {
        if (error instanceof ApiHttpError && error.status === 401) {
          onLogout();
          throw error;
        }

        if (error instanceof Error && error.message) {
          setMeetingRequestErrorMessage(error.message);
        } else {
          setMeetingRequestErrorMessage("Gorusme istegi olusturulamadi.");
        }
        throw error;
      } finally {
        setIsCreatingMeetingRequest(false);
      }
    },
    [onLogout, onRequireLogin, session],
  );

  const pageName = useMemo(() => PAGE_NAMES[currentPath] ?? "Dashboard", [currentPath]);

  if (!session) {
    return null;
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {isMobile && mobileOpen && (
        <div
          role="button"
          aria-label="Menuyu kapat"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              setMobileOpen(false);
            }
          }}
          tabIndex={0}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            zIndex: 50,
          }}
        />
      )}

      <CustomerPanelSidebar
        currentPath={currentPath}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        onMobileClose={() => setMobileOpen(false)}
        onNavigate={onNavigate}
        onLogout={onLogout}
        userName={session.userName}
        roleLabel={session.role || "CLIENT"}
        unreadTickets={dashboardData?.unreadTickets ?? 0}
        pendingInvoices={dashboardData?.pendingInvoices ?? 0}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <CustomerPanelHeader
          pageName={pageName}
          isMobile={isMobile}
          onMenuToggle={() => setMobileOpen((prev) => !prev)}
          onLogout={onLogout}
          userName={session.userName}
          userEmail={session.userEmail}
          roleLabel={session.role || "CLIENT"}
        />

        <main style={{ flex: 1, overflow: "auto", backgroundColor: "#F9FAFB", padding: isMobile ? 16 : 24 }}>
          <CustomerPanelContent
            currentPath={currentPath}
            dashboardData={dashboardData}
            isLoading={isLoadingData}
            errorMessage={errorMessage}
            tickets={tickets}
            isLoadingTickets={isLoadingTickets}
            isCreatingTicket={isCreatingTicket}
            ticketErrorMessage={ticketErrorMessage}
            meetingNotes={meetingNotes}
            isLoadingMeetingNotes={isLoadingMeetingNotes}
            meetingNotesErrorMessage={meetingNotesErrorMessage}
            isLoadingMeetingRequests={isLoadingTickets}
            meetingRequestsErrorMessage={ticketErrorMessage}
            isCreatingMeetingRequest={isCreatingMeetingRequest}
            meetingRequestErrorMessage={meetingRequestErrorMessage}
            selectedMeetingProjectId={selectedMeetingProjectId}
            projects={dashboardData?.projects ?? []}
            onMeetingProjectChange={setSelectedMeetingProjectId}
            onCreateMeetingRequest={handleCreateMeetingRequest}
            onCreateTicket={handleCreateTicket}
          />
        </main>
      </div>
    </div>
  );
}
