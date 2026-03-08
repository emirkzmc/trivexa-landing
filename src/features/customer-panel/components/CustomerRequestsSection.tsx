import { useState, type FormEvent } from "react";
import type {
  CreateCustomerTicketInput,
  CustomerPanelProject,
  CustomerPanelTicket,
} from "../model/types";
import Input from "../../../shared/ui/Input";
import Button from "../../../shared/ui/Button";
import TableCard from "./TableCard";

interface CustomerRequestsSectionProps {
  tickets: CustomerPanelTicket[];
  isLoading: boolean;
  isCreating: boolean;
  errorMessage: string | null;
  projects: CustomerPanelProject[];
  onCreateTicket: (input: CreateCustomerTicketInput) => Promise<void>;
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
    GELISTIRME: "Geliştirme",
    TEST: "Test",
    TESLIM: "Teslim",
  };

  return labels[stage] || prettify(stage);
}

function mapDisplayStatus(item: CustomerPanelTicket): string {
  const normalizedStatus = (item.status || "").toUpperCase();
  const normalizedApproval = (item.approvalStatus || "").toUpperCase();

  if (normalizedStatus === "RESOLVED" || normalizedStatus === "CLOSED" || normalizedStatus === "COMPLETED") {
    return "Tamamlandı";
  }

  if (normalizedApproval === "APPROVED") {
    return "Onaylandı";
  }

  return "Onay Bekliyor";
}

export default function CustomerRequestsSection({
  tickets,
  isLoading,
  isCreating,
  errorMessage,
  projects,
  onCreateTicket,
}: CustomerRequestsSectionProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [type, setType] = useState("SUPPORT");
  const [projectId, setProjectId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!subject.trim()) {
      setFormError("Başlık zorunludur.");
      return;
    }

    if (!description.trim()) {
      setFormError("Açıklama zorunludur.");
      return;
    }

    try {
      await onCreateTicket({
        subject: subject.trim(),
        description: description.trim(),
        priority,
        type,
        projectId: projectId || undefined,
      });
      setSubject("");
      setDescription("");
      setPriority("MEDIUM");
      setType("SUPPORT");
      setProjectId("");
    } catch (error) {
      if (error instanceof Error && error.message) {
        setFormError(error.message);
      } else {
        setFormError("Talep oluşturulamadı.");
      }
    }
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
    : [["-", "-", "Henüz talep bulunmuyor", "-", "-", "-", "-"]];

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-[#111827]">Yeni Talep Oluştur</h3>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <Input
            id="ticket-subject"
            name="ticket-subject"
            placeholder="Talep başlığı"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
          />

          <textarea
            id="ticket-description"
            name="ticket-description"
            placeholder="Talep açıklaması"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-28 w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#111827]"
            required
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <select
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              className="h-11 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-[#111827]"
            >
              <option value="">Proje Seç (Opsiyonel)</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="h-11 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-[#111827]"
            >
              <option value="LOW">Düşük</option>
              <option value="MEDIUM">Orta</option>
              <option value="HIGH">Yüksek</option>
              <option value="URGENT">Acil</option>
            </select>

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="h-11 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-[#111827]"
            >
              <option value="SUPPORT">Destek</option>
              <option value="BUG">Hata</option>
              <option value="FEATURE">Özellik</option>
              <option value="OTHER">Diğer</option>
            </select>
          </div>

          {(formError || errorMessage) && (
            <p className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs text-[#b91c1c]">
              {formError || errorMessage}
            </p>
          )}

          <Button type="submit" variant="login" disabled={isCreating}>
            {isCreating ? "OLUŞTURULUYOR..." : "TALEP OLUŞTUR"}
          </Button>
        </form>
      </section>

      {isLoading ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Talepler yükleniyor...
        </section>
      ) : (
        <TableCard
          title="Taleplerim"
          columns={["No", "Proje", "Başlık", "Aşama", "Öncelik", "Durum", "Tarih"]}
          rows={rows}
        />
      )}
    </div>
  );
}
