import { useState } from "react";

export type NavPath = "/" | "/iletisim" | "/takim";

interface NavbarProps {
  currentPath: NavPath;
  isScrolled: boolean;
  onNavigate: (path: NavPath) => void;
}

export default function Navbar({ currentPath, isScrolled, onNavigate }: NavbarProps) {
  const hasSolidStyle = currentPath !== "/" || isScrolled;
  const textColorClass = hasSolidStyle ? "text-[#111827]" : "text-white";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems: Array<{ label: string; path: NavPath }> = [
    { label: "Ana Sayfa", path: "/" },
    { label: "Iletisim", path: "/iletisim" },
    { label: "Takim", path: "/takim" },
  ];
  const menuId = "landing-mobile-menu";

  const handleNavigate = (path: NavPath) => {
    setIsMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        hasSolidStyle ? "bg-black/6 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-350 items-center justify-between px-6 md:px-12">
        <button
          type="button"
          onClick={() => handleNavigate("/")}
          className={`text-2xl tracking-[0.12em] ${textColorClass}`}
        >
          TRIVEXA
        </button>
        <ul className={`hidden items-center gap-8 text-sm font-medium md:flex md:text-base ${textColorClass}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                type="button"
                onClick={() => handleNavigate(item.path)}
                className={currentPath === item.path ? "underline underline-offset-4" : ""}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
        >
          <span className="sr-only">Menu</span>
          <span className="relative h-5 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded-full transition-transform duration-200 ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              } ${hasSolidStyle ? "bg-[#111827]" : "bg-white"}`}
            />
            <span
              className={`absolute left-0 top-2 h-0.5 w-5 rounded-full transition-opacity duration-200 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              } ${hasSolidStyle ? "bg-[#111827]" : "bg-white"}`}
            />
            <span
              className={`absolute left-0 top-4 h-0.5 w-5 rounded-full transition-transform duration-200 ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              } ${hasSolidStyle ? "bg-[#111827]" : "bg-white"}`}
            />
          </span>
        </button>
      </nav>
      <div id={menuId} className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div
          className={`px-6 pb-6 ${
            hasSolidStyle ? "bg-white/90 text-[#111827]" : "bg-black/40 text-white"
          } backdrop-blur-md`}
        >
          <ul className="flex flex-col gap-4 pt-4 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full text-left ${currentPath === item.path ? "underline underline-offset-4" : ""}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
