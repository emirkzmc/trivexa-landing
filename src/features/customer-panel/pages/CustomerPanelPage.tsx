import { useCallback, useEffect, useMemo, useState } from "react";
import CustomerPanelContent from "../components/CustomerPanelContent";
import CustomerPanelHeader from "../components/CustomerPanelHeader";
import CustomerPanelSidebar from "../components/CustomerPanelSidebar";
import { MOBILE_BREAKPOINT, PAGE_NAMES } from "../model/constants";
import {
  ApiHttpError,
  createCustomerTicket,
  getCustomerDashboard,
  getCustomerTickets,
} from "../model/api";
import {
  type CreateCustomerTicketInput,
  CUSTOMER_PANEL_PATHS,
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
          setErrorMessage("Panel verileri alınırken bir hata oluştu.");
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
        setTicketErrorMessage("Talepler alınırken bir hata oluştu.");
      }
    } finally {
      setIsLoadingTickets(false);
    }
  }, [onLogout, session]);

  useEffect(() => {
    if (currentPath !== "/customer-panel/talepler" && currentPath !== "/customer-panel/onaylar") {
      return;
    }
    void fetchTickets();
  }, [currentPath, fetchTickets]);

  const handleCreateTicket = useCallback(
    async (input: CreateCustomerTicketInput) => {
      if (!session) {
        onRequireLogin();
        throw new Error("Oturum bulunamadı.");
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
          setTicketErrorMessage("Talep oluşturulamadı.");
        }
        throw error;
      } finally {
        setIsCreatingTicket(false);
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
          aria-label="Menüyü kapat"
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
            projects={dashboardData?.projects ?? []}
            onCreateTicket={handleCreateTicket}
          />
        </main>
      </div>
    </div>
  );
}
