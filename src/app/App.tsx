import { useEffect, useState } from "react";
import "./App.css";
import Footer from "../shared/layout/Footer";
import Navbar, { type NavPath } from "../shared/layout/Navbar";
import ContactPage from "../features/contact/pages/ContactPage";
import HomePage from "../features/home/pages/HomePage";
import TeamPage from "../features/team/pages/TeamPage";
import CustomerPanelPage, {
  CUSTOMER_PANEL_DEFAULT_PATH,
  isCustomerPanelPath,
  type CustomerPanelPath,
} from "../features/customer-panel/pages/CustomerPanelPage";
import CustomerLoginPage from "../features/customer-panel/pages/CustomerLoginPage";
import type { CustomerPanelSession } from "../features/customer-panel/model/types";

const CUSTOMER_PANEL_SESSION_KEY = "trivexa-landing-customer-session";

type CustomerLoginPath = `/customer-login${string}`;
type AppPath = NavPath | CustomerPanelPath | CustomerLoginPath;

function normalizePath(pathname: string, search: string): AppPath {
  if (pathname === "/portal/auth/verify") {
    return `/customer-login${search}` as CustomerLoginPath;
  }
  if (pathname.startsWith("/customer-login")) {
    return `${pathname}${search}` as CustomerLoginPath;
  }
  if (isCustomerPanelPath(pathname)) {
    return pathname;
  }
  if (pathname.startsWith("/customer-panel")) {
    return CUSTOMER_PANEL_DEFAULT_PATH;
  }
  if (pathname === "/iletisim") {
    return "/iletisim";
  }
  if (pathname === "/takim") {
    return "/takim";
  }
  return "/";
}

function readStoredSession(): CustomerPanelSession | null {
  try {
    const raw = window.localStorage.getItem(CUSTOMER_PANEL_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CustomerPanelSession;
    if (!parsed?.accessToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistSession(session: CustomerPanelSession) {
  window.localStorage.setItem(CUSTOMER_PANEL_SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  window.localStorage.removeItem(CUSTOMER_PANEL_SESSION_KEY);
}

function isCustomerPanelRoute(path: AppPath): path is CustomerPanelPath {
  return path.startsWith("/customer-panel");
}

function isCustomerLoginRoute(path: AppPath): path is CustomerLoginPath {
  return path.startsWith("/customer-login");
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<AppPath>(() =>
    normalizePath(window.location.pathname, window.location.search),
  );
  const [portalSession, setPortalSession] = useState<CustomerPanelSession | null>(() => readStoredSession());
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleWindowScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname, window.location.search));
      handleWindowScroll();
    };

    window.addEventListener("scroll", handleWindowScroll);
    window.addEventListener("popstate", handlePopState);
    handleWindowScroll();

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (`${window.location.pathname}${window.location.search}` !== currentPath) {
      window.history.replaceState({}, "", currentPath);
    }
  }, [currentPath]);

  const handleNavigate = (path: AppPath, smoothScroll = true) => {
    if (path !== currentPath) {
      window.history.pushState({}, "", path);
      setCurrentPath(path);
    }
    if (smoothScroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePortalLogin = (session: CustomerPanelSession) => {
    persistSession(session);
    setPortalSession(session);
    handleNavigate(CUSTOMER_PANEL_DEFAULT_PATH, false);
  };

  const handlePortalLogout = () => {
    clearSession();
    setPortalSession(null);
    handleNavigate("/customer-login", false);
  };

  const handlePortalRequireLogin = () => {
    if (portalSession) return;
    handleNavigate("/customer-login", false);
  };

  const currentPage = (() => {
    if (isCustomerLoginRoute(currentPath)) {
      return <CustomerLoginPage onLogin={handlePortalLogin} />;
    }
    if (isCustomerPanelRoute(currentPath)) {
      return (
        <CustomerPanelPage
          currentPath={currentPath}
          onNavigate={(path) => handleNavigate(path, false)}
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

  if (isCustomerPanelRoute(currentPath) || isCustomerLoginRoute(currentPath)) {
    return currentPage;
  }

  return (
    <>
      <Navbar currentPath={currentPath} isScrolled={isScrolled} onNavigate={(path) => handleNavigate(path)} />
      {currentPage}
      <Footer />
    </>
  );
}
