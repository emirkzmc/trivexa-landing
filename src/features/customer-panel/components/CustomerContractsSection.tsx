import type { CustomerPanelContract } from "../model/types";

interface CustomerContractsSectionProps {
  contracts: CustomerPanelContract[];
  isLoading: boolean;
  errorMessage: string | null;
  onSelectContract?: (contractId: string) => void;
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

function mapStatusLabel(status: string): string {
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

export default function CustomerContractsSection({
  contracts,
  isLoading,
  errorMessage,
  onSelectContract,
}: CustomerContractsSectionProps) {
  if (isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Sozlesmeler yukleniyor...
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {errorMessage}
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-900">Sozlesmelerim</h3>
      <p className="mt-2 text-sm text-slate-600">
        Imzali sozlesme dosyalarinizi buradan goruntuleyebilirsiniz.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-2 py-3 font-semibold">Baslik</th>
              <th className="px-2 py-3 font-semibold">Durum</th>
              <th className="px-2 py-3 font-semibold">Baslangic</th>
              <th className="px-2 py-3 font-semibold">Bitis</th>
              <th className="px-2 py-3 font-semibold">Tutar</th>
              <th className="px-2 py-3 font-semibold">Imzali Dosya</th>
            </tr>
          </thead>
          <tbody>
            {contracts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-2 py-6 text-center text-sm text-slate-500">
                  Sozlesme bulunmuyor.
                </td>
              </tr>
            ) : (
              contracts.map((contract) => (
                <tr
                  key={contract.id}
                  className={`border-b border-slate-100 text-slate-700${onSelectContract ? " cursor-pointer hover:bg-slate-50" : ""}`}
                  onClick={() => {
                    if (onSelectContract) {
                      onSelectContract(contract.id);
                    }
                  }}
                >
                  <td className="px-2 py-3 font-semibold text-slate-900">{contract.title || "-"}</td>
                  <td className="px-2 py-3">{mapStatusLabel(contract.status)}</td>
                  <td className="px-2 py-3">{formatDate(contract.startDate)}</td>
                  <td className="px-2 py-3">{formatDate(contract.endDate)}</td>
                  <td className="px-2 py-3">{formatValue(contract.value)}</td>
                  <td className="px-2 py-3">
                    {contract.signedUrl ? (
                      <a
                        href={contract.signedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-slate-700 underline hover:text-slate-900"
                      >
                        Goruntule
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
