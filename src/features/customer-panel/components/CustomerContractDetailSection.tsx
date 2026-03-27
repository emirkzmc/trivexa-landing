import type { CustomerPanelContract } from "../model/types";
import PillBadge from "../../../shared/ui/PillBadge";
import StatCard from "../../../shared/ui/StatCard";
import Surface from "../../../shared/ui/Surface";

interface CustomerContractDetailSectionProps {
  contract: CustomerPanelContract;
  onBack: () => void;
}

function formatDate(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("tr-TR");
}

function formatValue(value?: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `${value.toLocaleString("tr-TR")} TL`;
}

function mapContractStatus(status: string): string {
  const normalized = (status || "").toUpperCase();
  const labels: Record<string, string> = {
    DRAFT: "Taslak",
    PENDING_APPROVAL: "Onay Bekliyor",
    APPROVED: "Onaylandi",
    SIGNED: "Imzalandi",
    EXPIRED: "Suresi Doldu",
    TERMINATED: "Feshedildi",
  };
  return labels[normalized] || normalized || "-";
}

export default function CustomerContractDetailSection({
  contract,
  onBack,
}: CustomerContractDetailSectionProps) {
  return (
    <Surface className="p-6">
      <button
        type="button"
        onClick={onBack}
        className="text-xs font-semibold text-slate-500 hover:text-slate-700"
      >
        &larr; Sozlesmelere Don
      </button>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{contract.title || "-"}</h3>
        <PillBadge>{mapContractStatus(contract.status)}</PillBadge>
      </div>

      {contract.description && (
        <p className="mt-2 text-sm text-slate-600">{contract.description}</p>
      )}

      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Baslangic" value={formatDate(contract.startDate)} valueClassName="text-sm font-semibold text-slate-900" />
        <StatCard label="Bitis" value={formatDate(contract.endDate)} valueClassName="text-sm font-semibold text-slate-900" />
        <StatCard label="Tutar" value={formatValue(contract.value)} valueClassName="text-sm font-semibold text-slate-900" />
        <StatCard
          label="Imzali Dosya"
          value={contract.signedUrl ? (
            <a
              href={contract.signedUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm font-semibold text-slate-700 underline hover:text-slate-900"
            >
              Goruntule
            </a>
          ) : "-"}
          valueClassName="text-sm font-semibold text-slate-900"
        />
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2">
        <StatCard label="Olusturma" value={formatDate(contract.createdAt)} valueClassName="text-sm font-semibold text-slate-900" className="bg-white" />
        <StatCard label="Guncellenme" value={formatDate(contract.updatedAt)} valueClassName="text-sm font-semibold text-slate-900" className="bg-white" />
      </section>
    </Surface>
  );
}
