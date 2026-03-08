import { LogoutIcon, MenuIcon } from "./icons";

interface CustomerPanelHeaderProps {
  pageName: string;
  isMobile: boolean;
  onMenuToggle: () => void;
  onLogout: () => void;
  userName: string;
  userEmail: string;
  roleLabel: string;
}

export default function CustomerPanelHeader({
  pageName,
  isMobile,
  onMenuToggle,
  onLogout,
  userName,
  userEmail,
  roleLabel,
}: CustomerPanelHeaderProps) {
  const initials = (userName.trim().charAt(0) || "M").toUpperCase();

  return (
    <header
      style={{
        height: 56,
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #F1F5F9",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isMobile && (
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="Menuyu ac"
            title="Menuyu ac"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              backgroundColor: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <MenuIcon />
          </button>
        )}

        <p
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          {pageName}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            backgroundColor: "#11182720",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          {initials}
        </div>

        {!isMobile && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap" }}>{userName}</span>
              <span style={{ fontSize: 11, color: "#6B7280", whiteSpace: "nowrap" }}>{userEmail}</span>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
                border: "1px solid #E5E7EB",
                backgroundColor: "#F9FAFB",
                padding: "4px 8px",
                fontSize: 11,
                fontWeight: 600,
                color: "#4B5563",
              }}
            >
              {roleLabel}
            </span>
            <button
              type="button"
              onClick={onLogout}
              title="Cikis"
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: "6px 8px",
                backgroundColor: "#FFFFFF",
                color: "#4B5563",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <LogoutIcon />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
