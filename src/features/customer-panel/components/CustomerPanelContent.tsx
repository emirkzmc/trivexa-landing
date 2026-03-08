import { APPROVAL_ROWS, MEETING_NOTE_ROWS, PROJECT_ROWS, REQUEST_ROWS } from "../model/constants";
import type { CustomerPanelDashboardData, CustomerPanelPath } from "../model/types";
import DashboardStats from "./DashboardStats";
import TableCard from "./TableCard";

interface CustomerPanelContentProps {
  currentPath: CustomerPanelPath;
  dashboardData: CustomerPanelDashboardData | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export default function CustomerPanelContent({
  currentPath,
  dashboardData,
  isLoading,
  errorMessage,
}: CustomerPanelContentProps) {
  if (isLoading && !dashboardData) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Panel verileri yukleniyor...
      </section>
    );
  }

  if (errorMessage && !dashboardData) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {errorMessage}
      </section>
    );
  }

  if (currentPath === "/customer-panel/dashboard") {
    return <DashboardStats dashboardData={dashboardData} />;
  }

  if (currentPath === "/customer-panel/projeler") {
    const rows = dashboardData?.projects.length
      ? dashboardData.projects.map((item) => [item.name, item.progress, item.status])
      : PROJECT_ROWS.map((item) => [item.name, item.progress, item.status]);

    return (
      <TableCard
        title="Projelerim"
        columns={["Proje", "Ilerleme", "Durum"]}
        rows={rows}
      />
    );
  }

  if (currentPath === "/customer-panel/talepler") {
    return (
      <TableCard
        title="Talepler"
        columns={["No", "Baslik", "Oncelik", "Durum"]}
        rows={REQUEST_ROWS.map((item) => [item.id, item.title, item.priority, item.status])}
      />
    );
  }

  if (currentPath === "/customer-panel/notlar") {
    return (
      <TableCard
        title="Gorusme Notlari"
        columns={["No", "Baslik", "Tarih"]}
        rows={MEETING_NOTE_ROWS.map((item) => [item.id, item.title, item.date])}
      />
    );
  }

  return (
    <TableCard
      title="Onay Bekleyen"
      columns={["No", "Icerik", "Termin", "Durum"]}
      rows={APPROVAL_ROWS.map((item) => [item.id, item.title, item.due, item.status])}
    />
  );
}
