import Label from "./Label";

const services = [
  {
    title: "Web Uygulama Geliştirme",
    description: "Performans odaklı, ölçeklenebilir ve sürdürülebilir web ürünleri geliştiriyoruz.",
  },
  {
    title: "Mobil Uygulama Geliştirme",
    description: "iOS ve Android için kullanıcı odaklı, hızlı ve güvenilir mobil deneyimler tasarlıyoruz.",
  },
  {
    title: "UI/UX Tasarım",
    description: "Markanıza uygun, sade ve etkili arayüzlerle kullanıcı deneyimini güçlendiriyoruz.",
  },
  {
    title: "Teknik Danışmanlık",
    description: "Mimari kararlar, kod kalitesi ve ürün yol haritasında ekibinize stratejik destek veriyoruz.",
  },
];

const processSteps = [
  {
    title: "Keşif ve Planlama",
    description: "İhtiyaçları netleştirir, hedefleri ölçülebilir adımlara dönüştürürüz.",
  },
  {
    title: "Tasarım ve Prototipleme",
    description: "Kullanıcı akışlarını tasarlar, fikirleri hızlı prototiplerle görünür hale getiririz.",
  },
  {
    title: "Geliştirme ve Test",
    description: "Temiz kod, düzenli test ve iteratif teslimatlarla güvenli bir süreç yürütürüz.",
  },
  {
    title: "Yayın ve Büyüme",
    description: "Ürünü yayına alır, metriklerle izler ve sürekli iyileştirme uygularız.",
  },
];

const stats = [
  { value: "50+", label: "Tamamlanan Proje" },
  { value: "12", label: "Farklı Sektör" },
  { value: "%98", label: "Zamanında Teslimat" },
  { value: "24/7", label: "Teknik Destek" },
];

export default function HomeExtraSections() {
  return (
    <>
      <section className="bg-[#F8F9FB] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-6xl">
          <Label>Hizmetler</Label>
          <h3 className="mt-4 text-3xl font-semibold text-[#111827] md:text-4xl">Uçtan uca yazılım çözümleri</h3>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <article key={service.title} className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-6">
                <h4 className="text-xl font-semibold text-[#111827]">{service.title}</h4>
                <p className="mt-3 text-base leading-7 text-[#4b5563]">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fb] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-6xl">
          <Label>Süreç</Label>
          <h3 className="mt-4 text-3xl font-semibold text-[#111827] md:text-4xl">Nasıl çalışıyoruz?</h3>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {processSteps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
                <p className="text-sm font-semibold text-[#6b7280]">0{index + 1}</p>
                <h4 className="mt-2 text-lg font-semibold text-[#111827]">{step.title}</h4>
                <p className="mt-3 text-sm leading-6 text-[#4b5563]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8F9FB] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[#e5e7eb] bg-[#111827] p-8 text-white md:p-12">
          <Label className="text-white/80">Trivexa Etkisi</Label>
          <h3 className="mt-4 text-3xl font-semibold md:text-4xl">Ürününüzü daha hızlı ve daha doğru büyütün</h3>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label}>
                <p className="text-4xl font-bold">{item.value}</p>
                <p className="mt-2 text-sm text-white/80">{item.label}</p>
              </div>
            ))}
          </div>
          <a
            href="/iletisim"
            className="mt-10 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#f3f4f6]"
          >
            Projeni Konuşalım
          </a>
        </div>
      </section>
    </>
  );
}
