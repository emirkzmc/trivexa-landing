import { type FormEvent, useState } from "react";
import Input from "../../../shared/ui/Input";
import Label from "../../../shared/ui/Label";
import FormField from "../../../shared/ui/FormField";
import SectionBlock from "../../../shared/ui/SectionBlock";
import { useLandingContent } from "../../../shared/hooks/useLandingContent";
import { submitLandingContactForm } from "../api/contact.api";

export default function ContactSection() {
  const { content } = useLandingContent();
  const contact = content.contact;
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!form.fullName.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setFeedback({ type: "error", text: "Lutfen zorunlu alanlari doldurun." });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLandingContactForm({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setFeedback({
        type: "success",
        text: "Mesajiniz alindi. Ekibimiz en kisa surede sizinle iletisime gececek.",
      });
      setForm({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text: error instanceof Error ? error.message : "Mesaj gonderilemedi. Lutfen tekrar deneyin.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SectionBlock
      className="min-h-screen scroll-mt-24 bg-[#f8f9fb]"
      containerClassName="max-w-6xl px-6 sm:px-10"
    >
      <div className="mb-12">
        <Label>{contact.label}</Label>
        <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#111827] sm:text-4xl md:text-5xl">
          {contact.title}
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-7 text-[#374151] sm:text-lg sm:leading-8">
          {contact.description}
        </p>
      </div>

      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <div>
          <img
            src={contact.image}
            alt="Iletisim gorseli"
            className="h-64 w-full rounded-lg border border-[#e5e7eb] object-cover shadow-sm backdrop-blur-2xl sm:h-72 md:h-full"
          />
        </div>

        <div>
          <form className="flex flex-col gap-5 rounded-2xl md:px-8" onSubmit={handleSubmit}>
              <FormField label="İsim" htmlFor="name">
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Ad Soyad"
                  value={form.fullName}
                  onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                />
              </FormField>

              <FormField label="Mail" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="ornek@firma.com"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </FormField>

              <FormField label="Telefon" htmlFor="phone">
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+90 5xx xxx xx xx"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </FormField>

              <FormField label="Firma" htmlFor="company">
                <Input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="Firma adı (opsiyonel)"
                  value={form.company}
                  onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
                />
              </FormField>

              <FormField label="Konu" htmlFor="subject">
                <Input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="Kısa konu başlığı"
                  value={form.subject}
                  onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                />
              </FormField>

              <FormField label="Açıklama" htmlFor="description">
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Proje detaylarını kısaca paylaşın..."
                  className="rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#111827]"
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                />
              </FormField>

              {feedback && (
                <p className={`text-sm font-medium ${feedback.type === "success" ? "text-emerald-700" : "text-red-600"}`}>
                  {feedback.text}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full rounded-full bg-[#111827] px-8 py-3 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                </button>
              </div>
          </form>
        </div>
      </div>
    </SectionBlock>
  );
}
