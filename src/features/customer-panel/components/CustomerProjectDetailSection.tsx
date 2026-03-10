import type { CustomerPanelProjectDetail } from "../model/types";
import PillBadge from "../../../shared/ui/PillBadge";
import StatCard from "../../../shared/ui/StatCard";
import Surface from "../../../shared/ui/Surface";

interface CustomerProjectDetailSectionProps {
  detail: CustomerPanelProjectDetail;
  onBack: () => void;
}

function calculateProgressValue(detail: CustomerPanelProjectDetail): number {
  const { taskMetrics, taskSummary } = detail;
  if (typeof taskMetrics?.percentage === "number" && Number.isFinite(taskMetrics.percentage)) {
    return Math.round(taskMetrics.percentage);
  }
  const summaryTotal = taskSummary?.total ?? 0;
  if (summaryTotal > 0) {
    return Math.round(((taskSummary?.byStatus?.DONE ?? 0) / summaryTotal) * 100);
  }
  return 0;
}

export default function CustomerProjectDetailSection({
  detail,
  onBack,
}: CustomerProjectDetailSectionProps) {
  const { project, taskMetrics, taskSummary, recentTasks } = detail;
  const progressValue = calculateProgressValue(detail);

  return (
    <Surface className="p-6">
      <button
        type="button"
        onClick={onBack}
        className="text-xs font-semibold text-slate-500 hover:text-slate-700"
      >
        &larr; Projelere Don
      </button>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
        <PillBadge>{project.status}</PillBadge>
      </div>

      {project.description && (
        <p className="mt-2 text-sm text-slate-600">{project.description}</p>
      )}

      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Baslangic" value={project.startDate || "-"} valueClassName="text-sm font-semibold text-slate-900" />
        <StatCard label="Teslim" value={project.deadline || "-"} valueClassName="text-sm font-semibold text-slate-900" />
        <StatCard
          label="Butce"
          value={typeof project.budget === "number" ? `${project.budget.toLocaleString("tr-TR")} TL` : "-"}
          valueClassName="text-sm font-semibold text-slate-900"
        />
        <StatCard label="Ilerleme" value={`%${progressValue}`} valueClassName="text-sm font-semibold text-slate-900" />
      </section>

      <section className="mt-5 grid gap-3 lg:grid-cols-2">
        <Surface as="article" className="p-4">
          <h4 className="text-sm font-semibold text-slate-900">Gorev Ozeti</h4>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              Toplam: <strong>{taskSummary?.total ?? taskMetrics?.total ?? 0}</strong>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              Tamamlanan: <strong>{taskMetrics?.completed ?? taskSummary?.byStatus?.DONE ?? 0}</strong>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              Devam Eden: <strong>{taskSummary?.byStatus?.IN_PROGRESS ?? 0}</strong>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              Bu Hafta Biten: <strong>{taskSummary?.doneThisWeek ?? 0}</strong>
            </div>
          </div>
        </Surface>

        <Surface as="article" className="p-4">
          <h4 className="text-sm font-semibold text-slate-900">Durum Dagilimi</h4>
          <div className="mt-3 space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <span>Todo</span>
              <strong>{taskSummary?.byStatus?.TODO ?? 0}</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <span>In Progress</span>
              <strong>{taskSummary?.byStatus?.IN_PROGRESS ?? 0}</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <span>In Review</span>
              <strong>{taskSummary?.byStatus?.IN_REVIEW ?? 0}</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <span>Blocked</span>
              <strong>{taskSummary?.byStatus?.BLOCKED ?? 0}</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <span>Done</span>
              <strong>{taskSummary?.byStatus?.DONE ?? 0}</strong>
            </div>
          </div>
        </Surface>
      </section>

      <Surface className="mt-5 p-4">
        <h4 className="text-sm font-semibold text-slate-900">Son Gorevler</h4>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-2 py-2 font-semibold">Gorev</th>
                <th className="px-2 py-2 font-semibold">Durum</th>
                <th className="px-2 py-2 font-semibold">Oncelik</th>
                <th className="px-2 py-2 font-semibold">Sorumlu</th>
              </tr>
            </thead>
            <tbody>
              {!recentTasks || recentTasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-2 py-4 text-center text-xs text-slate-500">
                    Gosterilecek gorev bulunamadi.
                  </td>
                </tr>
              ) : (
                recentTasks.map((task) => (
                  <tr key={task.id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-2 py-2 font-medium text-slate-900">{task.title}</td>
                    <td className="px-2 py-2">{task.status}</td>
                    <td className="px-2 py-2">{task.priority || "-"}</td>
                    <td className="px-2 py-2">{task.assigneeName || task.assigneeEmail || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Surface>
    </Surface>
  );
}
