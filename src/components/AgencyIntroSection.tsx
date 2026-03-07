import Label from "./Label";
import ScrollVelocity from "./ScrollVelocity.tsx";
export default function AgencyIntroSection() {
  return (
    <section id="agency-intro" className="flex flex-col gap-18 min-h-screen scroll-mt-24 bg-[#f8f9fb] px-10 md:py-20 md:px-48 ">
      <div className=" max-w-5xl">
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
      <div>
        <ScrollVelocity
            texts={['Trivexa', 'Solve the Problem,']}
            velocity={80}
            className="custom-scroll-text mt-20"
        />
      </div>

    </section>
  );
}
