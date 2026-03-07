export type NavPath = "/" | "/iletisim" | "/takim";

interface NavbarProps {
  currentPath: NavPath;
  isScrolled: boolean;
  onNavigate: (path: NavPath) => void;
}

export default function Navbar({ currentPath, isScrolled, onNavigate }: NavbarProps) {
  const hasSolidStyle = currentPath !== "/" || isScrolled;
  const textColorClass = hasSolidStyle ? "text-[#111827]" : "text-white";
  const navItems: Array<{ label: string; path: NavPath }> = [
    { label: "Ana Sayfa", path: "/" },
    { label: "İletişim", path: "/iletisim" },
    { label: "Takım", path: "/takim" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        hasSolidStyle ? "bg-black/6 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-350 items-center justify-between px-8 md:px-12">
        <button type="button" onClick={() => onNavigate("/")} className={`text-xl font-semibold tracking-[0.12em] ${textColorClass}`}>
          TRIVEXA
        </button>
        <ul className={`flex items-center gap-8 text-sm font-medium md:text-base ${textColorClass}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                type="button"
                onClick={() => onNavigate(item.path)}
                className={currentPath === item.path ? "underline underline-offset-4" : ""}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
