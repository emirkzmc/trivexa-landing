import Input from "../../../shared/ui/Input";
import Label from "../../../shared/ui/Label";

export default function ContactSection() {
  return (
    <section id="contact-section" className="min-h-screen scroll-mt-24 bg-[#f8f9fb] px-6 py-24 md:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <Label>İLETİŞİM</Label>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#111827] md:text-5xl">Projenizi birlikte planlayalım.</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#374151]">
            Kısa bir formla ihtiyacınızı aktarın, ekibimiz en kısa sürede size dönüş yapsın.
          </p>
        </div>

        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <img
              src="/contact.png"
              alt="İletişim görseli"
              className="w-full  border border-[#e5e7eb] object-cover shadow-sm backdrop-blur-2xl rounded-lg"
            />
          </div>

          <div>
            <form className="flex flex-col gap-5 rounded-2xl  md:px-8">
              <div className="flex flex-col gap-2">
                <Label variant="field" htmlFor="name">
                  İsim
                </Label>
                <Input id="name" type="text" name="name" placeholder="Ad Soyad" />
              </div>

              <div className="flex flex-col gap-2">
                <Label variant="field" htmlFor="email">
                  Mail
                </Label>
                <Input id="email" type="email" name="email" placeholder="ornek@firma.com" />
              </div>

              <div className="flex flex-col gap-2">
                <Label variant="field" htmlFor="phone">
                  Telefon
                </Label>
                <Input id="phone" type="tel" name="phone" placeholder="+90 5xx xxx xx xx" />
              </div>

              <div className="flex flex-col gap-2">
                <Label variant="field" htmlFor="subject">
                  Konu
                </Label>
                <Input id="subject" type="text" name="subject" placeholder="Kısa konu başlığı" />
              </div>

              <div className="flex flex-col gap-2">
                <Label variant="field" htmlFor="description">
                  Açıklama
                </Label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  placeholder="Proje detaylarını kısaca paylaşın..."
                  className="rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#111827]"
                />
              </div>

              <div>
                <button type="submit" className="rounded-full bg-[#111827] px-8 py-3 text-sm font-medium text-white transition hover:bg-black">
                  Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
