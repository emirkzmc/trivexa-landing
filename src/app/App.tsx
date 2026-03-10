import { useState } from "react";
import "./App.css";
import Footer from "../shared/layout/Footer";
import Navbar from "../shared/layout/Navbar";
import ContactPage from "../features/contact/pages/ContactPage";
import HomePage from "../features/home/pages/HomePage";
import TeamPage from "../features/team/pages/TeamPage";
import CustomerPanelPage, {
  CUSTOMER_PANEL_DEFAULT_PATH,
} from "../features/customer-panel/pages/CustomerPanelPage";
import CustomerLoginPage from "../features/customer-panel/pages/CustomerLoginPage";
import PasswordResetPreviewPage from "../features/customer-panel/pages/PasswordResetPreviewPage";
import type { CustomerPanelSession } from "../features/customer-panel/model/types";
import { clearPortalSession, persistPortalSession, readPortalSession } from "./portalSession";
import { isCustomerLoginRoute, isCustomerPanelRoute } from "./router/routeUtils";
import { useAppRouter } from "./router/useAppRouter";

export default function App() {
  const { currentPath, isScrolled, navigate } = useAppRouter();
  const [portalSession, setPortalSession] = useState<CustomerPanelSession | null>(() => readPortalSession());

  const handlePortalLogin = (session: CustomerPanelSession) => {
    persistPortalSession(session);
    setPortalSession(session);
    navigate(CUSTOMER_PANEL_DEFAULT_PATH, false);
  };

  const handlePortalLogout = () => {
    clearPortalSession();
    setPortalSession(null);
    navigate("/customer-login", false);
  };

  const handlePortalRequireLogin = () => {
    if (portalSession) return;
    navigate("/customer-login", false);
  };

  const currentPage = (() => {
    if (currentPath === "/password-reset-preview") {
      return <PasswordResetPreviewPage />;
    }
    if (isCustomerLoginRoute(currentPath)) {
      return <CustomerLoginPage onLogin={handlePortalLogin} />;
    }
    if (isCustomerPanelRoute(currentPath)) {
      return (
        <CustomerPanelPage
          currentPath={currentPath}
          onNavigate={(path) => navigate(path, false)}
          session={portalSession}
          onLogout={handlePortalLogout}
          onRequireLogin={handlePortalRequireLogin}
        />
      );
    }
    if (currentPath === "/iletisim") {
      return <ContactPage />;
    }
    if (currentPath === "/takim") {
      return <TeamPage />;
    }
    return <HomePage />;
  })();

  if (
    isCustomerPanelRoute(currentPath)
    || isCustomerLoginRoute(currentPath)
    || currentPath === "/password-reset-preview"
  ) {
    return currentPage;
  }

  return (
    <>
      <Navbar currentPath={currentPath} isScrolled={isScrolled} onNavigate={(path) => navigate(path)} />
      {currentPage}
      <Footer />
    </>
  );
}
