import type { CustomerPanelTicket } from "../model/types";
import InfoMessage from "../../../shared/ui/InfoMessage";
import PillBadge from "../../../shared/ui/PillBadge";
import SectionHeader from "../../../shared/ui/SectionHeader";
import StatCard from "../../../shared/ui/StatCard";
import Surface from "../../../shared/ui/Surface";

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

function stageTone(stage?: string): "warning" | "success" | "info" {
  if (!stage) return "warning";
  if (stage === "TESLIM") return "success";
  return "info";
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
      <Surface className="p-5">
        <SectionHeader
          title="Onay Bekleyen Isler"
          description="Admin panelinde onaylanan talepler burada listelenir ve mevcut asama goruntulenir."
        />

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <StatCard label="Onay Bekleyen" value={pendingInvoices} />
          <StatCard label="Asama Secili" value={withStageCount} />
          <StatCard label="Asama Bekleyen" value={waitingStageCount} />
        </div>
      </Surface>

      {isLoading ? (
        <InfoMessage message="Onay kalemleri yukleniyor..." />
      ) : errorMessage ? (
        <InfoMessage message={errorMessage} tone="error" />
      ) : approvedRequests.length === 0 ? (
        <InfoMessage message="Henuz admin onayindan gecmis talep bulunmuyor." />
      ) : (
        <Surface className="p-5">
          <div className="space-y-3">
            {approvedRequests.map((item) => (
              <Surface key={item.id} as="article" className="rounded-lg p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#111827]">{item.subject || "Talep"}</p>
                  <PillBadge tone={stageTone(item.stage)}>
                    {stageLabel(item.stage)}
                  </PillBadge>
                </div>

                <p className="mt-2 text-sm text-slate-600">{item.description || "-"}</p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-md bg-slate-100 px-2 py-1">Proje: {item.projectName || "Belirtilmedi"}</span>
                  <span className="rounded-md bg-slate-100 px-2 py-1">Oncelik: {prettify(item.priority)}</span>
                  <span className="rounded-md bg-slate-100 px-2 py-1">Tip: {prettify(item.type)}</span>
                  <span className="rounded-md bg-slate-100 px-2 py-1">Tarih: {formatDate(item.createdAt)}</span>
                </div>
              </Surface>
            ))}
          </div>
        </Surface>
      )}
    </div>
  );
}
