import { useRef, useState, type FormEvent } from "react";
import type { CreateCustomerTicketInput, CustomerPanelProject } from "../model/types";
import Input from "../../../shared/ui/Input";
import Button from "../../../shared/ui/Button";
import SectionHeader from "../../../shared/ui/SectionHeader";
import Surface from "../../../shared/ui/Surface";

interface LocalFileItem {
  id: string;
  file: File;
}

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const rounded = value >= 100 ? value.toFixed(0) : value.toFixed(1);
  return `${rounded} ${units[unitIndex]}`;
}

function createFileItem(file: File): LocalFileItem {
  return {
    id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
    file,
  };
}

interface CustomerRequestFormProps {
  projects: CustomerPanelProject[];
  isCreating: boolean;
  errorMessage: string | null;
  onCreateTicket: (input: CreateCustomerTicketInput) => Promise<void>;
}

export default function CustomerRequestForm({
  projects,
  isCreating,
  errorMessage,
  onCreateTicket,
}: CustomerRequestFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [type, setType] = useState("SUPPORT");
  const [projectId, setProjectId] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<LocalFileItem[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  function addFiles(files: FileList | File[]) {
    const next = Array.from(files)
      .filter((file) => file.size > 0)
      .map((file) => createFileItem(file));
    if (next.length === 0) return;
    setSelectedFiles((prev) => [...prev, ...next]);
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    addFiles(event.target.files);
    event.target.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      addFiles(event.dataTransfer.files);
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }

  function removeFile(id: string) {
    setSelectedFiles((prev) => prev.filter((item) => item.id !== id));
  }

  function clearAll() {
    setSelectedFiles([]);
  }

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
      setSelectedFiles([]);
    } catch (error) {
      if (error instanceof Error && error.message) {
        setFormError(error.message);
      } else {
        setFormError("Talep olusturulamadi.");
      }
    }
  }

  return (
    <Surface className="p-5">
      <SectionHeader title="Yeni Talep Olustur" />
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

        <div className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Dosyalar</p>
              <p className="mt-1 text-sm text-slate-600">
                Talebiniz icin belge ekleyin. Birden fazla dosya ekleyebilirsiniz.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Dosya Sec
              </button>
              <button
                type="button"
                onClick={clearAll}
                disabled={selectedFiles.length === 0}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Temizle
              </button>
            </div>
          </div>

          <label
            htmlFor="customer-ticket-files"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={[
              "mt-4 flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center text-sm transition",
              isDragging
                ? "border-slate-900 bg-white text-slate-900"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
            ].join(" ")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
              DOSYA
            </div>
            <p className="text-sm font-semibold text-slate-700">Dosyalari buraya surukleyip birakin</p>
            <p className="text-xs text-slate-400">PNG, JPG, PDF veya DOCX - coklu secim desteklenir</p>
          </label>
          <input
            id="customer-ticket-files"
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="sr-only"
          />

          {selectedFiles.length > 0 && (
            <div className="mt-4 grid gap-2">
              {selectedFiles.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.file.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(item.file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(item.id)}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                  >
                    Kaldir
                  </button>
                </div>
              ))}
            </div>
          )}
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
    </Surface>
  );
}
