import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Navbar, { type NavPath } from "./components/Navbar";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import TeamPage from "./pages/TeamPage";

function normalizePath(pathname: string): NavPath {
  if (pathname === "/iletisim") {
    return "/iletisim";
  }
  if (pathname === "/takim") {
    return "/takim";
  }
  return "/";
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<NavPath>(() => normalizePath(window.location.pathname));
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleWindowScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
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

  const handleNavigate = (path: NavPath) => {
    if (path !== currentPath) {
      window.history.pushState({}, "", path);
      setCurrentPath(path);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentPage = useMemo(() => {
    if (currentPath === "/iletisim") {
      return <ContactPage />;
    }
    if (currentPath === "/takim") {
      return <TeamPage />;
    }
    return <HomePage />;
  }, [currentPath]);

  return (
    <>
      <Navbar currentPath={currentPath} isScrolled={isScrolled} onNavigate={handleNavigate} />
      {currentPage}
      <Footer />
    </>
  );
}
