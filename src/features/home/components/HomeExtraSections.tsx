import Label from "../../../shared/ui/Label";
import SectionBlock from "../../../shared/ui/SectionBlock";
import { useLandingContent } from "../../../shared/hooks/useLandingContent";

interface ServiceCardProps {
  title: string;
  description: string;
}

function ServiceCard({ title, description }: ServiceCardProps) {
  return (
    <article className="h-full rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-6">
      <h4 className="text-xl font-semibold text-[#111827]">{title}</h4>
      <p className="mt-3 text-base leading-7 text-[#4b5563]">{description}</p>
    </article>
  );
}

interface ProcessStepCardProps {
  title: string;
  description: string;
  index: number;
}

function ProcessStepCard({ title, description, index }: ProcessStepCardProps) {
  return (
    <article className="h-full rounded-2xl border border-[#e5e7eb] bg-white p-6">
      <p className="text-sm font-semibold text-[#6b7280]">0{index}</p>
      <h4 className="mt-2 text-lg font-semibold text-[#111827]">{title}</h4>
      <p className="mt-3 text-sm leading-6 text-[#4b5563]">{description}</p>
    </article>
  );
}

interface ImpactStatProps {
  label: string;
  value: string;
}

function ImpactStat({ label, value }: ImpactStatProps) {
  return (
    <div>
      <p className="text-4xl font-bold">{value}</p>
      <p className="mt-2 text-sm text-white/80">{label}</p>
    </div>
  );
}

export default function HomeExtraSections() {
  const { content } = useLandingContent();

  return (
    <>
      <SectionBlock className="bg-[#F8F9FB]">
        <Label>{content.services.label}</Label>
        <h3 className="mt-4 text-2xl font-semibold text-[#111827] sm:text-3xl md:text-4xl">{content.services.title}</h3>
        <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-2">
          {content.services.items.map((service) => (
            <ServiceCard key={service.title} title={service.title} description={service.description} />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock className="bg-[#f8f9fb]">
        <Label>{content.process.label}</Label>
        <h3 className="mt-4 text-2xl font-semibold text-[#111827] sm:text-3xl md:text-4xl">{content.process.title}</h3>
        <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {content.process.steps.map((step, index) => (
            <ProcessStepCard
              key={step.title}
              title={step.title}
              description={step.description}
              index={index + 1}
            />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock className="bg-[#F8F9FB]">
        <div
          className="rounded-3xl border border-[#e5e7eb] p-6 text-white sm:p-8 md:p-12"
          style={{ backgroundColor: content.impact.backgroundColor }}
        >
          <Label className="text-white">{content.impact.label}</Label>
          <h3 className="mt-4 text-2xl font-semibold sm:text-3xl md:text-4xl">{content.impact.title}</h3>
          <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 md:grid-cols-4">
            {content.impact.stats.map((item) => (
              <ImpactStat key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
          <a
            href={content.impact.ctaLink}
            className="mt-8 inline-flex w-full justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#f3f4f6] sm:mt-10 sm:w-auto"
          >
            {content.impact.ctaLabel}
          </a>
        </div>
      </SectionBlock>
    </>
  );
}
