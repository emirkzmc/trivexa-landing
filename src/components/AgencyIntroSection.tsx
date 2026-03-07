import Label from "./Label";

export default function AgencyIntroSection() {
  return (
    <section id="agency-intro" className="min-h-screen scroll-mt-24 bg-[#f8f9fb] px-6 py-24 md:px-20">
      <div className="mx-auto max-w-5xl">
        <Label>TRIVEXA</Label>
        <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#111827] md:text-5xl">
          Yazılım ajansınız: fikri ürüne, ürünü büyümeye dönüştürüyoruz.
        </h2>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-[#374151]">
          Trivexa; web ve mobil uygulama geliştirme, ürün tasarımı, altyapı kurulumu ve teknik danışmanlık alanlarında
          uç uca hizmet veren bir yazılım ajansıdır. Ekibimiz, markanızın hedeflerine uygun, ölçeklenebilir ve
          performans odaklı dijital ürünler tasarlar.
        </p>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#374151]">
          Süreci netleştiren, hızlı teslimat yapan ve kaliteyi koruyan bir yaklaşımla çalışırız. İster sıfırdan bir
          ürün geliştirin, ister mevcut projenizi bir üst seviyeye taşıyın; Trivexa teknik gücünüz olur.
        </p>
      </div>
    </section>
  );
}
