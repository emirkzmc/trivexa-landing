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
      setFormError("Baslik zorunludur.");
      return;
    }

    if (!description.trim()) {
      setFormError("Aciklama zorunludur.");
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
        setFormError("Talep olusturulamadi.");
      }
    }
  }

  const rows = tickets.length
    ? tickets.map((item) => [
      item.id || "-",
      item.projectName || "-",
      item.subject || "-",
      prettify(item.priority),
      prettify(item.status),
      formatDate(item.createdAt),
    ])
    : [["-", "-", "Henuz talep bulunmuyor", "-", "-", "-"]];

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-[#111827]">Yeni Talep Olustur</h3>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <Input
            id="ticket-subject"
            name="ticket-subject"
            placeholder="Talep basligi"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
          />

          <textarea
            id="ticket-description"
            name="ticket-description"
            placeholder="Talep aciklamasi"
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
              <option value="">Proje Sec (Opsiyonel)</option>
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
              <option value="LOW">Dusuk</option>
              <option value="MEDIUM">Orta</option>
              <option value="HIGH">Yuksek</option>
              <option value="URGENT">Acil</option>
            </select>

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="h-11 rounded-lg border border-[#d1d5db] bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-[#111827]"
            >
              <option value="SUPPORT">Destek</option>
              <option value="BUG">Hata</option>
              <option value="FEATURE">Ozellik</option>
              <option value="OTHER">Diger</option>
            </select>
          </div>

          {(formError || errorMessage) && (
            <p className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs text-[#b91c1c]">
              {formError || errorMessage}
            </p>
          )}

          <Button type="submit" variant="login" disabled={isCreating}>
            {isCreating ? "OLUSTURULUYOR..." : "TALEP OLUSTUR"}
          </Button>
        </form>
      </section>

      {isLoading ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Talepler yukleniyor...
        </section>
      ) : (
        <TableCard
          title="Taleplerim"
          columns={["No", "Proje", "Baslik", "Oncelik", "Durum", "Tarih"]}
          rows={rows}
        />
      )}
    </div>
  );
}
