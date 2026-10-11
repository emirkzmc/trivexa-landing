import { useState } from "react";
import "./App.css";
import Footer from "../shared/layout/Footer";
import Navbar from "../shared/layout/Navbar";
import ContactPage from "../features/contact/pages/ContactPage";
import HomePage from "../features/home/pages/HomePage";
import TeamPage from "../features/team/pages/TeamPage";
import CustomerPanelPage from "../features/customer-panel/pages/CustomerPanelPage";
import { CUSTOMER_PANEL_DEFAULT_PATH } from "../features/customer-panel/model/constants";
import CustomerLoginPage from "../features/customer-panel/pages/CustomerLoginPage";
import PasswordResetPreviewPage from "../features/customer-panel/pages/PasswordResetPreviewPage";
import type { CustomerPanelSession } from "../features/customer-panel/model/types";
import { persistPortalSession, readPortalSession, clearPortalSession } from "./portalSession";
import { isCustomerLoginRoute, isCustomerPanelRoute } from "./router/routeUtils";
import { useAppRouter } from "./router/useAppRouter";
import PolicyPage from "../features/policies/pages/PolicyPage";
import DemoExplanationPage from "../features/demo/pages/DemoExplanationPage";
import { FeatureFlagService } from "../shared/services/feature-flag.service";

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
    if (currentPath === "/gizlilik-politikasi") {
      return <PolicyPage type="privacy" />;
    }
    if (currentPath === "/kullanici-politikasi") {
      return <PolicyPage type="user" />;
    }
    
    if (FeatureFlagService.isEnabled('DEMO_MODE') && currentPath === "/") {
      return <DemoExplanationPage />;
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
