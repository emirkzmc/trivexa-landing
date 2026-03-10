import type { CustomerPanelDashboardData } from "../model/types";
import InfoMessage from "../../../shared/ui/InfoMessage";
import StatCard from "../../../shared/ui/StatCard";

interface DashboardStatsProps {
  dashboardData: CustomerPanelDashboardData | null;
}

export default function DashboardStats({ dashboardData }: DashboardStatsProps) {
  if (!dashboardData) {
    return <InfoMessage message="Dashboard verisi backend'den henÃ¼z alÄ±nmadÄ±." />;
  }

  const stats = [
    { label: "Aktif Proje", value: String(dashboardData.activeProjects) },
    { label: "AÃ§Ä±k Talep", value: String(dashboardData.unreadTickets) },
    { label: "Onay Bekleyen", value: String(dashboardData.pendingInvoices) },
    { label: "Toplam Proje", value: String(dashboardData.projects.length) },
  ];

  return (
    <section
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      }}
    >
      {stats.map((item) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={item.value}
          valueClassName="text-3xl font-semibold text-[#111827]"
          className="rounded-2xl bg-white p-5"
        />
      ))}
    </section>
  );
}
