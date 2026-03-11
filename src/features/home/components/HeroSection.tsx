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
      <div className="relative mx-auto w-full max-w-3xl px-6 py-16 text-center text-white sm:px-10 md:py-20 md:text-left">
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
          {content.hero.title}
        </h1>
        <p className="mt-5 text-lg font-light leading-relaxed sm:text-xl md:text-2xl">
          {content.hero.subtitle}
        </p>
        <div className="mt-8 sm:mt-10">
          <Button
            text={content.hero.ctaLabel}
            onClick={onStartClick}
            className="w-full rounded-full border border-white/80 bg-white px-8 py-3 text-sm font-medium text-black transition-transform duration-300 hover:scale-105 ease-in-out hover:bg-white/90 sm:w-auto"
          />
        </div>
      </div>
    </section>
  );
}
