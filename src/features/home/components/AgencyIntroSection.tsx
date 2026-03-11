import Label from "../../../shared/ui/Label";
import ScrollVelocity from "../../../shared/ui/ScrollVelocity";
import { useLandingContent } from "../../../shared/hooks/useLandingContent";

export default function AgencyIntroSection() {
  const { content } = useLandingContent();
  const intro = content.intro;

  return (
    <section
      id="agency-intro"
      className="flex min-h-screen scroll-mt-24 flex-col gap-10 bg-[#f8f9fb] px-6 py-16 sm:px-10 md:gap-14 md:px-20 md:py-20 lg:px-48"
    >
      <div className="max-w-5xl">
        <Label>{intro.label}</Label>
        <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#111827] sm:text-4xl md:text-5xl">
          {intro.title}
        </h2>
        {intro.paragraphs.map((paragraph, index) => (
          <p
            key={`intro-paragraph-${index}`}
            className={`${index === 0 ? "mt-6" : "mt-4"} max-w-3xl text-base leading-7 text-[#374151] sm:text-lg sm:leading-8`}
          >
            {paragraph}
          </p>
        ))}
      </div>
      <div>
        <ScrollVelocity texts={intro.tickerTexts} velocity={80} className="custom-scroll-text mt-10 md:mt-16" />
      </div>
    </section>
  );
}
