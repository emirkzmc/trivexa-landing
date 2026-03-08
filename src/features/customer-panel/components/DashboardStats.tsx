import type { CustomerPanelDashboardData } from "../model/types";

interface DashboardStatsProps {
  dashboardData: CustomerPanelDashboardData | null;
}

export default function DashboardStats({ dashboardData }: DashboardStatsProps) {
  if (!dashboardData) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Dashboard verisi backend'den henuz alinmadi.
      </section>
    );
  }

  const stats = [
    { label: "Aktif Proje", value: String(dashboardData.activeProjects) },
    { label: "Acik Talep", value: String(dashboardData.unreadTickets) },
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
        <article
          key={item.label}
          style={{
            border: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{item.label}</p>
          <p style={{ margin: "8px 0 0", fontSize: 30, fontWeight: 600, color: "#111827" }}>{item.value}</p>
        </article>
      ))}
    </section>
  );
}
