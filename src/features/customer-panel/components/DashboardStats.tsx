import { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import type { CustomerPanelDashboardData } from "../model/types";
import InfoMessage from "../../../shared/ui/InfoMessage";
import PillBadge from "../../../shared/ui/PillBadge";
import StatCard from "../../../shared/ui/StatCard";
import Surface from "../../../shared/ui/Surface";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface DashboardStatsProps {
  dashboardData: CustomerPanelDashboardData | null;
}

export default function DashboardStats({ dashboardData }: DashboardStatsProps) {
  const projects = useMemo(() => dashboardData?.projects || [], [dashboardData?.projects]);

  const stats = [
    { label: "Aktif Proje", value: String(dashboardData?.activeProjects || 0) },
    { label: "Acik Talep", value: String(dashboardData?.unreadTickets || 0) },
    { label: "Onay Bekleyen", value: String(dashboardData?.pendingInvoices || 0) },
    { label: "Toplam Proje", value: String(projects.length) },
  ];

  const parseProgress = (value: string) => {
    if (!value) return 0;
    const parsed = Number.parseFloat(value.replace("%", "").trim());
    if (Number.isNaN(parsed)) return 0;
    if (parsed <= 1) return Math.round(parsed * 100);
    return Math.round(Math.min(parsed, 100));
  };

  const projectStatusData = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((project) => {
      const label = project.status?.trim() || "Bilinmiyor";
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });

    const labels = Array.from(counts.keys());
    const data = Array.from(counts.values());
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#111827", "#9CA3AF", "#E5E7EB", "#F59E0B", "#10B981", "#3B82F6"],
          borderWidth: 0,
        },
      ],
    };
  }, [projects]);

  const progressData = useMemo(() => {
    const items = [...projects]
      .map((project) => ({
        name: project.name,
        progress: parseProgress(project.progress),
      }))
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 6);

    return {
      labels: items.map((item) => item.name),
      datasets: [
        {
          label: "Ilerleme (%)",
          data: items.map((item) => item.progress),
          backgroundColor: "#111827",
          borderRadius: 8,
          barThickness: 16,
        },
      ],
    };
  }, [projects]);

  const statusSummary = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((project) => {
      const key = project.status?.trim() || "Bilinmiyor";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [projects]);

  const progressBuckets = useMemo(() => {
    const buckets = {
      dusuk: 0,
      orta: 0,
      yuksek: 0,
    };

    projects.forEach((project) => {
      const progress = parseProgress(project.progress);
      if (progress < 40) {
        buckets.dusuk += 1;
      } else if (progress < 80) {
        buckets.orta += 1;
      } else {
        buckets.yuksek += 1;
      }
    });

    return buckets;
  }, [projects]);

  const topProgressProjects = useMemo(() => {
    return [...projects]
      .map((project) => ({
        id: project.id,
        name: project.name,
        status: project.status?.trim() || "Bilinmiyor",
        progress: parseProgress(project.progress),
      }))
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5);
  }, [projects]);

  const lowProgressProjects = useMemo(() => {
    return [...projects]
      .map((project) => ({
        id: project.id,
        name: project.name,
        status: project.status?.trim() || "Bilinmiyor",
        progress: parseProgress(project.progress),
      }))
      .filter((project) => project.progress < 40)
      .sort((a, b) => a.progress - b.progress)
      .slice(0, 4);
  }, [projects]);

  const resolveStatusTone = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized.includes("tamam") || normalized.includes("done")) return "success";
    if (normalized.includes("devam") || normalized.includes("progress")) return "info";
    if (normalized.includes("blok") || normalized.includes("risk") || normalized.includes("bekle")) return "warning";
    return "neutral";
  };

  const averageProgress = useMemo(() => {
    const values = projects
      .map((project) => Number.parseFloat(project.progress?.replace("%", "").trim() || "0"))
      .filter((value) => Number.isFinite(value));
    if (!values.length) return "0%";
    const avg = values.reduce((acc, value) => acc + value, 0) / values.length;
    return `${Math.round(avg)}%`;
  }, [projects]);

  if (!dashboardData) {
    return <InfoMessage message="Dashboard verisi backend'den henuz alinmadi." />;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            valueClassName="text-3xl font-semibold text-[#111827]"
            className="rounded-2xl bg-white p-5"
          />
        ))}
        <StatCard
          label="Ortalama Ilerleme"
          value={averageProgress}
          valueClassName="text-3xl font-semibold text-[#111827]"
          className="rounded-2xl bg-white p-5"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Surface as="section" className="rounded-2xl bg-white p-6">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Proje Durumu</p>
            <h3 className="mt-1 text-lg font-semibold text-[#111827]">Durum Dagilimi</h3>
          </div>
          {dashboardData.projects.length === 0 ? (
            <InfoMessage message="Henuz proje bulunmuyor." />
          ) : (
            <div className="h-72">
              <Doughnut
                data={projectStatusData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        usePointStyle: true,
                      },
                    },
                  },
                  cutout: "65%",
                }}
              />
            </div>
          )}
        </Surface>

        <Surface as="section" className="rounded-2xl bg-white p-6">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Ilerleme</p>
            <h3 className="mt-1 text-lg font-semibold text-[#111827]">Proje Ilerleme Grafikleri</h3>
          </div>
          {dashboardData.projects.length === 0 ? (
            <InfoMessage message="Grafik icin proje bulunmuyor." />
          ) : (
            <div className="h-72">
              <Bar
                data={progressData}
                options={{
                  maintainAspectRatio: false,
                  indexAxis: "y",
                  scales: {
                    x: {
                      min: 0,
                      max: 100,
                      ticks: {
                        callback: (value) => `${value}%`,
                      },
                    },
                    y: {
                      ticks: {
                        autoSkip: false,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          )}
        </Surface>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Surface as="section" className="rounded-2xl bg-white p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Proje Ozeti</p>
              <h3 className="mt-1 text-lg font-semibold text-[#111827]">Ilerleme ve Durum</h3>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-slate-500">Genel Ortalama</p>
              <p className="text-lg font-semibold text-[#111827]">{averageProgress}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Dusuk</p>
              <p className="mt-2 text-2xl font-semibold text-[#111827]">{progressBuckets.dusuk}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Orta</p>
              <p className="mt-2 text-2xl font-semibold text-[#111827]">{progressBuckets.orta}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Yuksek</p>
              <p className="mt-2 text-2xl font-semibold text-[#111827]">{progressBuckets.yuksek}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {statusSummary.length === 0 ? (
              <InfoMessage message="Durum ozeti bulunamadi." />
            ) : (
              statusSummary.map(([label, count]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                  <PillBadge tone={resolveStatusTone(label)}>{label}</PillBadge>
                  <span className="text-sm font-semibold text-[#111827]">{count}</span>
                </div>
              ))
            )}
          </div>
        </Surface>

        <Surface as="section" className="rounded-2xl bg-white p-6">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Oncelikli Projeler</p>
            <h3 className="mt-1 text-lg font-semibold text-[#111827]">Ilerleme Ozeti</h3>
          </div>
          {topProgressProjects.length === 0 ? (
            <InfoMessage message="Henuz proje bulunmuyor." />
          ) : (
            <div className="space-y-4">
              {topProgressProjects.map((project) => (
                <div key={project.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{project.name}</p>
                      <p className="mt-1 text-xs text-slate-500">Ilerleme: {project.progress}%</p>
                    </div>
                    <PillBadge tone={resolveStatusTone(project.status)}>{project.status}</PillBadge>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-[#111827]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs uppercase tracking-wide text-amber-700">Dusuk Ilerleme</p>
            {lowProgressProjects.length === 0 ? (
              <p className="mt-2 text-sm text-amber-800">Dusuk ilerlemeli proje yok.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm text-amber-900">
                {lowProgressProjects.map((project) => (
                  <li key={project.id} className="flex items-center justify-between gap-2">
                    <span>{project.name}</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Surface>
      </div>
    </section>
  );
}
