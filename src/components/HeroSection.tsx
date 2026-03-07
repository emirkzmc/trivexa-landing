import Button from "./Button";

interface HeroSectionProps {
  onStartClick: () => void;
}

export default function HeroSection({ onStartClick }: HeroSectionProps) {
  return (
    <section
      id="home-section"
      className="relative flex min-h-screen w-full scroll-mt-24 items-center bg-[url('/photo.png')] bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative ml-[230px] w-[550px] text-white">
        <h1 className="text-6xl font-semibold leading-tight">Bir yönetimden daha fazlası</h1>
        <p className="mt-5 text-2xl font-light leading-relaxed">Harika fikirler, güçlü yazılımlarla hayat bulur.</p>
        <div className="mt-10">
          <Button
            text="Hemen Başla"
            onClick={onStartClick}
            className="rounded-full border border-white/80 bg-white px-12 py-3 text-lg font-medium text-black transition-transform duration-300 hover:scale-105 hover:bg-white/90"
          />
        </div>
      </div>
    </section>
  );
}
