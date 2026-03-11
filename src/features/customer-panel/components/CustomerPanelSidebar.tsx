import { NAV_ITEMS, SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_EXPANDED_WIDTH, MOBILE_SIDEBAR_WIDTH } from "../model/constants";
import { CUSTOMER_PANEL_CONTRACT_DETAIL_PREFIX, CUSTOMER_PANEL_PROJECT_DETAIL_PREFIX } from "../model/types";
import type { CustomerPanelPath } from "../model/types";
import { ChevronRightIcon, CloseIcon, LogoutIcon, SquareGridIcon, ItemIcon } from "./icons";
import CustomerPanelAvatar from "./CustomerPanelAvatar";

interface CustomerPanelSidebarProps {
  currentPath: CustomerPanelPath;
  isMobile: boolean;
  mobileOpen: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onMobileClose: () => void;
  onNavigate: (path: CustomerPanelPath) => void;
  onLogout: () => void;
  userName: string;
  roleLabel: string;
  unreadTickets: number;
  pendingInvoices: number;
}

export default function CustomerPanelSidebar({
  currentPath,
  isMobile,
  mobileOpen,
  collapsed,
  onToggleCollapse,
  onMobileClose,
  onNavigate,
  onLogout,
  userName,
  roleLabel,
  unreadTickets,
  pendingInvoices,
}: CustomerPanelSidebarProps) {
  const collapsedState = isMobile ? false : collapsed;
  const sidebarWidth = isMobile ? MOBILE_SIDEBAR_WIDTH : collapsedState ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  function handleTopButtonClick() {
    if (isMobile) {
      onMobileClose();
      return;
    }
    onToggleCollapse();
  }

  function handleItemClick(path: CustomerPanelPath) {
    onNavigate(path);
    if (isMobile) {
      onMobileClose();
    }
  }

  return (
    <aside
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: sidebarWidth,
        minWidth: sidebarWidth,
        backgroundColor: "#F3F4F6",
        color: "#111827",
        fontFamily: "'Poppins', system-ui, sans-serif",
        overflowY: "auto",
        overflowX: "hidden",
        borderRight: "1px solid #E5E7EB",
        transition: isMobile
          ? "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)"
          : "width 0.28s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        position: isMobile ? "fixed" : "relative",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: isMobile ? 60 : "auto",
        transform: isMobile ? (mobileOpen ? "translateX(0)" : "translateX(-100%)") : "none",
        boxShadow: isMobile ? "0 10px 30px rgba(0,0,0,0.2)" : "none",
      }}
    >
      <div
        style={{
          padding: collapsedState ? "20px 10px" : "24px 20px 20px",
          borderBottom: "1px solid #E5E7EB",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: collapsedState ? 8 : 0,
          transition: "padding 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "#111827",
            whiteSpace: "nowrap",
          }}
        >
          {collapsedState ? "TVX" : "TRIVEXA"}
        </span>

        <button
          onClick={handleTopButtonClick}
          title={isMobile ? "Menuyu kapat" : collapsedState ? "Menuyu ac" : "Menuyu kapat"}
          aria-label={isMobile ? "Menuyu kapat" : collapsedState ? "Menuyu ac" : "Menuyu kapat"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {isMobile ? <CloseIcon /> : <SquareGridIcon color="#111827" />}
        </button>
      </div>

      <nav style={{ flex: 1, padding: "12px 0" }}>
        <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.path
              || (item.path === "/customer-panel/projeler" && currentPath.startsWith(CUSTOMER_PANEL_PROJECT_DETAIL_PREFIX))
              || (item.path === "/customer-panel/sozlesmeler" && currentPath.startsWith(CUSTOMER_PANEL_CONTRACT_DETAIL_PREFIX));
            const itemColor = "#111827";
            const badgeCount = item.path === "/customer-panel/talepler"
              ? unreadTickets
              : item.path === "/customer-panel/onaylar"
                ? pendingInvoices
                : 0;

            return (
              <li key={item.path}>
                <button
                  type="button"
                  onClick={() => handleItemClick(item.path)}
                  title={collapsedState ? item.label : undefined}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsedState ? "center" : "flex-start",
                    gap: collapsedState ? 0 : 10,
                    padding: collapsedState ? "9px 0" : "9px 20px",
                    margin: collapsedState ? "1px 6px" : "1px 8px",
                    borderRadius: 8,
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: 13.5,
                    fontWeight: isActive ? 600 : 400,
                    color: itemColor,
                    backgroundColor: isActive ? "#11182718" : "transparent",
                    borderLeft: isActive && !collapsedState ? "3px solid #111827" : "3px solid transparent",
                    transition: "background-color 0.15s, color 0.15s",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ItemIcon icon={item.icon} color={itemColor} />
                  </span>

                  {!collapsedState && <span style={{ flex: 1, lineHeight: 1.3, whiteSpace: "nowrap" }}>{item.label}</span>}

                  {!collapsedState && badgeCount > 0 && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 18,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: "#111827",
                        color: "#FFFFFF",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "0 5px",
                      }}
                    >
                      {badgeCount > 99 ? "99+" : badgeCount}
                    </span>
                  )}

                  {!collapsedState && badgeCount === 0 && <ChevronRightIcon color="#6B7280" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        style={{
          borderTop: "1px solid #E5E7EB",
          padding: collapsedState ? "12px 0" : "12px 16px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: collapsedState ? "center" : "flex-start",
        }}
      >
        {!collapsedState && (
          <span
            style={{
              display: "inline-block",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#111827",
              backgroundColor: "#11182718",
              borderRadius: 4,
              padding: "2px 7px",
              marginBottom: 8,
              whiteSpace: "nowrap",
            }}
          >
            {roleLabel}
          </span>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: collapsedState ? 0 : 10,
            width: "100%",
            justifyContent: collapsedState ? "center" : "flex-start",
          }}
        >
          <CustomerPanelAvatar name={userName} backgroundColor="#11182730" />

          {!collapsedState && (
            <span
              style={{
                flex: 1,
                fontSize: 13,
                fontWeight: 500,
                color: "#111827",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userName}
            </span>
          )}

          {!collapsedState && (
            <button
              type="button"
              onClick={onLogout}
              title="Cikis"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 6,
                borderRadius: 6,
                color: "#6B7280",
                display: "flex",
                alignItems: "center",
              }}
            >
              <LogoutIcon />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
