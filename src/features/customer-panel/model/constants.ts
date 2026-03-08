import type { CustomerPanelNavItem, CustomerPanelPath } from "./types";

export const CUSTOMER_PANEL_DEFAULT_PATH: CustomerPanelPath = "/customer-panel/dashboard";

export const PAGE_NAMES: Record<CustomerPanelPath, string> = {
  "/customer-panel/dashboard": "Dashboard",
  "/customer-panel/projeler": "Projelerim",
  "/customer-panel/talepler": "Taleplerim",
  "/customer-panel/notlar": "Gorusme Notlari",
  "/customer-panel/onaylar": "Onay Bekleyen",
};

export const NAV_ITEMS: CustomerPanelNavItem[] = [
  { label: "Dashboard", path: "/customer-panel/dashboard", icon: "dashboard" },
  { label: "Projelerim", path: "/customer-panel/projeler", icon: "projects" },
  { label: "Taleplerim", path: "/customer-panel/talepler", icon: "requests" },
  { label: "Gorusme Notlari", path: "/customer-panel/notlar", icon: "notes" },
  { label: "Onay Bekleyen", path: "/customer-panel/onaylar", icon: "approvals" },
];

export const SIDEBAR_EXPANDED_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 100;
export const MOBILE_SIDEBAR_WIDTH = 280;
export const MOBILE_BREAKPOINT = 768;

export const DASHBOARD_STATS = [
  { label: "Aktif Proje", value: "3" },
  { label: "Acik Talep", value: "4" },
  { label: "Onay Bekleyen", value: "2" },
  { label: "Toplam Proje", value: "5" },
];

export const PROJECT_ROWS = [
  { name: "Kurumsal Web", progress: "%78", status: "Devam" },
  { name: "Landing Paketi", progress: "%42", status: "Planli" },
  { name: "Dashboard", progress: "%95", status: "Test" },
];

export const REQUEST_ROWS = [
  { id: "#TLP-203", title: "Icerik revizesi", priority: "Orta", status: "Acik" },
  { id: "#TLP-198", title: "Kategori ekleme", priority: "Dusuk", status: "Inceleme" },
  { id: "#TLP-194", title: "Banner guncelleme", priority: "Yuksek", status: "Cozum" },
];

export const MEETING_NOTE_ROWS = [
  { id: "#NOT-41", title: "Haftalik durum toplantisi", date: "08.03.2026" },
  { id: "#NOT-38", title: "Kampanya teslim planlamasi", date: "06.03.2026" },
  { id: "#NOT-35", title: "Revizyon geri bildirimi", date: "04.03.2026" },
];

export const APPROVAL_ROWS = [
  { id: "#ONY-88", title: "Kampanya kreatif", due: "08.03.2026", status: "Bekliyor" },
  { id: "#ONY-84", title: "Hero metni", due: "09.03.2026", status: "Revize" },
  { id: "#ONY-79", title: "Aylik rapor", due: "10.03.2026", status: "Bekliyor" },
];
