import Label from "../../../shared/ui/Label";
import { useLandingContent } from "../../../shared/hooks/useLandingContent";

export default function HomeExtraSections() {
  const { content } = useLandingContent();

  return (
    <>
      <section className="bg-[#F8F9FB] px-6 py-24 md:px-20">
        <div className="mx-auto max-w-6xl">
          <Label>{content.services.label}</Label>
          <h3 className="mt-4 text-3xl font-semibold text-[#111827] md:text-4xl">{content.services.title}</h3>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {content.services.items.map((service) => (
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
          <Label>{content.process.label}</Label>
          <h3 className="mt-4 text-3xl font-semibold text-[#111827] md:text-4xl">{content.process.title}</h3>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {content.process.steps.map((step, index) => (
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
        <div
          className="mx-auto max-w-6xl rounded-3xl border border-[#e5e7eb] p-8 text-white md:p-12"
          style={{ backgroundColor: content.impact.backgroundColor }}
        >
          <Label className="text-white">{content.impact.label}</Label>
          <h3 className="mt-4 text-3xl font-semibold md:text-4xl">{content.impact.title}</h3>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {content.impact.stats.map((item) => (
              <div key={item.label}>
                <p className="text-4xl font-bold">{item.value}</p>
                <p className="mt-2 text-sm text-white/80">{item.label}</p>
              </div>
            ))}
          </div>
          <a
            href={content.impact.ctaLink}
            className="mt-10 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#f3f4f6]"
          >
            {content.impact.ctaLabel}
          </a>
        </div>
      </section>
    </>
  );
}
