import Label from "../../../shared/ui/Label";
import ScrollVelocity from "../../../shared/ui/ScrollVelocity";
import { useLandingContent } from "../../../shared/hooks/useLandingContent";

export default function AgencyIntroSection() {
  const { content } = useLandingContent();
  const intro = content.intro;

  return (
    <section id="agency-intro" className="flex min-h-screen scroll-mt-24 flex-col gap-18 bg-[#f8f9fb] px-10 md:px-48 md:py-20">
      <div className="max-w-5xl">
        <Label>{intro.label}</Label>
        <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#111827] md:text-5xl">
          {intro.title}
        </h2>
        {intro.paragraphs.map((paragraph, index) => (
          <p key={`intro-paragraph-${index}`} className={`${index === 0 ? 'mt-8' : 'mt-6'} max-w-3xl text-lg leading-8 text-[#374151]`}>
            {paragraph}
          </p>
        ))}
      </div>
      <div>
        <ScrollVelocity texts={intro.tickerTexts} velocity={80} className="custom-scroll-text mt-20" />
      </div>
    </section>
  );
}
