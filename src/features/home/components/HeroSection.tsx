import Button from "../../../shared/ui/Button";
import { useLandingContent } from "../../../shared/hooks/useLandingContent";

interface HeroSectionProps {
  onStartClick: () => void;
}

export default function HeroSection({ onStartClick }: HeroSectionProps) {
  const { content } = useLandingContent();

  return (
    <section
      id="home-section"
      className="relative flex min-h-screen w-full scroll-mt-24 items-center bg-cover bg-center"
      style={{ backgroundImage: `url('${content.hero.backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative ml-50 w-137.5 text-white">
        <h1 className="text-6xl font-semibold leading-tight">{content.hero.title}</h1>
        <p className="mt-5 text-2xl font-light leading-relaxed">{content.hero.subtitle}</p>
        <div className="mt-10">
          <Button
            text={content.hero.ctaLabel}
            onClick={onStartClick}
            className="rounded-full border border-white/80 bg-white px-10 py-3 text-sm font-medium text-black transition-transform duration-300 hover:scale-105 ease-in-out hover:bg-white/90"
          />
        </div>
      </div>
    </section>
  );
}
