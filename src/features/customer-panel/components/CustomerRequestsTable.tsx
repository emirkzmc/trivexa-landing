import type { CustomerPanelTicket } from "../model/types";
import TableCard from "../../../shared/ui/TableCard";
import InfoMessage from "../../../shared/ui/InfoMessage";

interface CustomerRequestsTableProps {
  tickets: CustomerPanelTicket[];
  isLoading: boolean;
}

function formatDate(value: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("tr-TR");
}

function prettify(value: string): string {
  return value.replace(/_/g, " ");
}

function mapStageLabel(stage?: string): string {
  if (!stage) return "-";

  const labels: Record<string, string> = {
    ANALIZ: "Analiz",
    PLANLAMA: "Planlama",
    GELISTIRME: "Gelistirme",
    TEST: "Test",
    TESLIM: "Teslim",
  };

  return labels[stage] || prettify(stage);
}

function mapDisplayStatus(item: CustomerPanelTicket): string {
  const normalizedStatus = (item.status || "").toUpperCase();
  const normalizedApproval = (item.approvalStatus || "").toUpperCase();

  if (normalizedStatus === "RESOLVED" || normalizedStatus === "CLOSED" || normalizedStatus === "COMPLETED") {
    return "Tamamlandi";
  }

  if (normalizedApproval === "APPROVED") {
    return "Onaylandi";
  }

  return "Onay Bekliyor";
}

export default function CustomerRequestsTable({ tickets, isLoading }: CustomerRequestsTableProps) {
  if (isLoading) {
    return <InfoMessage message="Talepler yukleniyor..." />;
  }

  const rows = tickets.length
    ? tickets.map((item) => [
      item.id || "-",
      item.projectName || "-",
      item.subject || "-",
      mapStageLabel(item.stage),
      prettify(item.priority),
      mapDisplayStatus(item),
      formatDate(item.createdAt),
    ])
    : [["-", "-", "Henuz talep bulunmuyor", "-", "-", "-", "-"]];

  return (
    <TableCard
      title="Taleplerim"
      columns={["No", "Proje", "Baslik", "Asama", "Oncelik", "Durum", "Tarih"]}
      rows={rows}
    />
  );
}
