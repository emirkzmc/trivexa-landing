import type { CustomerPanelTicket } from "../model/types";

interface PendingApprovalsSectionProps {
  pendingInvoices: number;
  requests: CustomerPanelTicket[];
  isLoading: boolean;
  errorMessage: string | null;
}

const APPROVED_STATUS = "APPROVED";

const STAGE_LABELS: Record<string, string> = {
  ANALIZ: "Analiz",
  PLANLAMA: "Planlama",
  GELISTIRME: "Gelistirme",
  TEST: "Test",
  TESLIM: "Teslim",
};

function formatDate(value: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function prettify(value: string): string {
  return value.replace(/_/g, " ");
}

function stageLabel(stage?: string): string {
  if (!stage) return "Asama bekleniyor";
  return STAGE_LABELS[stage] || prettify(stage);
}

function stageTone(stage?: string): string {
  if (!stage) return "bg-amber-50 text-amber-700 border border-amber-200";
  if (stage === "TESLIM") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  return "bg-indigo-50 text-indigo-700 border border-indigo-200";
}

export default function PendingApprovalsSection({
  pendingInvoices,
  requests,
  isLoading,
  errorMessage,
}: PendingApprovalsSectionProps) {
  const approvedRequests = requests.filter((item) => item.approvalStatus === APPROVED_STATUS);
  const withStageCount = approvedRequests.filter((item) => !!item.stage).length;
  const waitingStageCount = approvedRequests.length - withStageCount;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#111827]">Onay Bekleyen Isler</h3>
            <p className="mt-1 text-sm text-slate-600">
              Admin panelinde onaylanan talepler burada listelenir ve mevcut asama goruntulenir.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Onay Bekleyen</p>
            <p className="mt-2 text-2xl font-semibold text-[#111827]">{pendingInvoices}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Asama Secili</p>
            <p className="mt-2 text-2xl font-semibold text-[#111827]">{withStageCount}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Asama Bekleyen</p>
            <p className="mt-2 text-2xl font-semibold text-[#111827]">{waitingStageCount}</p>
          </article>
        </div>
      </section>

      {isLoading ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Onay kalemleri yukleniyor...
        </section>
      ) : errorMessage ? (
        <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {errorMessage}
        </section>
      ) : approvedRequests.length === 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Henuz admin onayindan gecmis talep bulunmuyor.
        </section>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="space-y-3">
            {approvedRequests.map((item) => (
              <article key={item.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#111827]">{item.subject || "Talep"}</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stageTone(item.stage)}`}>
                    {stageLabel(item.stage)}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-600">{item.description || "-"}</p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-md bg-slate-100 px-2 py-1">Proje: {item.projectName || "Belirtilmedi"}</span>
                  <span className="rounded-md bg-slate-100 px-2 py-1">Oncelik: {prettify(item.priority)}</span>
                  <span className="rounded-md bg-slate-100 px-2 py-1">Tip: {prettify(item.type)}</span>
                  <span className="rounded-md bg-slate-100 px-2 py-1">Tarih: {formatDate(item.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
