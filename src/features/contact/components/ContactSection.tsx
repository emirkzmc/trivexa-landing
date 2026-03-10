import { type FormEvent, useState } from "react";
import Input from "../../../shared/ui/Input";
import Label from "../../../shared/ui/Label";
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
    <section id="contact-section" className="min-h-screen scroll-mt-24 bg-[#f8f9fb] px-6 py-24 md:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <Label>{contact.label}</Label>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#111827] md:text-5xl">{contact.title}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#374151]">{contact.description}</p>
        </div>

        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <img
              src={contact.image}
              alt="Iletisim gorseli"
              className="w-full rounded-lg border border-[#e5e7eb] object-cover shadow-sm backdrop-blur-2xl"
            />
          </div>

          <div>
            <form className="flex flex-col gap-5 rounded-2xl md:px-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label variant="field" htmlFor="name">
                  Isim
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Ad Soyad"
                  value={form.fullName}
                  onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label variant="field" htmlFor="email">
                  Mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="ornek@firma.com"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label variant="field" htmlFor="phone">
                  Telefon
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+90 5xx xxx xx xx"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label variant="field" htmlFor="company">
                  Firma
                </Label>
                <Input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="Firma adi (opsiyonel)"
                  value={form.company}
                  onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label variant="field" htmlFor="subject">
                  Konu
                </Label>
                <Input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="Kisa konu basligi"
                  value={form.subject}
                  onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label variant="field" htmlFor="description">
                  Aciklama
                </Label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  placeholder="Proje detaylarini kisaca paylasin..."
                  className="rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#111827]"
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                />
              </div>

              {feedback && (
                <p className={`text-sm font-medium ${feedback.type === "success" ? "text-emerald-700" : "text-red-600"}`}>
                  {feedback.text}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-[#111827] px-8 py-3 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Gonderiliyor..." : "Gonder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
