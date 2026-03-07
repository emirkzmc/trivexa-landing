import Label from "./Label";

export default function TeamSection() {
  return (
    <section id="team-section" className="min-h-screen scroll-mt-24 bg-white px-6 py-24 md:px-20">
      <div className="mx-auto max-w-5xl">
        <Label>TAKIM</Label>
        <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#111827] md:text-5xl">
          Deneyimli ekip, net süreç, sürdürülebilir çıktı.
        </h2>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-[#374151]">
          Ürün yöneticileri, tasarımcılar ve yazılım geliştiricilerden oluşan çekirdek ekibimiz; iş hedeflerinizi teknik
          gereksinimlere çevirir, iteratif ve şeffaf bir geliştirme süreciyle sonuca ulaşır.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-6">
            <h3 className="text-lg font-semibold text-[#111827]">Ürün ve Strateji</h3>
            <p className="mt-3 text-sm leading-6 text-[#4b5563]">İhtiyaç analizi, yol haritası, MVP planlama.</p>
          </article>
          <article className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-6">
            <h3 className="text-lg font-semibold text-[#111827]">Tasarım</h3>
            <p className="mt-3 text-sm leading-6 text-[#4b5563]">Kullanıcı odaklı arayüz ve deneyim tasarımı.</p>
          </article>
          <article className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-6">
            <h3 className="text-lg font-semibold text-[#111827]">Geliştirme</h3>
            <p className="mt-3 text-sm leading-6 text-[#4b5563]">Performanslı, güvenli ve ölçeklenebilir uygulamalar.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
