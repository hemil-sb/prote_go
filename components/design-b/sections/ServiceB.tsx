import { Check } from "lucide-react";
import { CYCLE, PLANS } from "@/content/plans";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";
import RailDots from "@/components/RailDots";

export default function ServiceB() {
  return (
    <section
      id="service"
      aria-labelledby="service-b-title"
      className="on-dark plus-field bg-sherpa py-16 text-white sm:py-24 lg:py-28"
      data-tone="dark"
      data-fade="tr"
    >
      <div className="wrap">
        <div className="text-center lg:text-left">
          <p className="text-sm font-semibold tabular-nums text-turquoise">Service</p>
          <Words id="service-b-title" text="We apply it. We prove it. We renew it." className="mt-3 text-headline font-normal" />
          <p className="mx-auto mt-4 max-w-[34rem] text-lede text-white/80 lg:mx-0">
            The Managed Protection Programme: a 30-day cycle, measured every visit.
          </p>
        </div>

        {/* the 30-day cycle: one compact numbered list on phones, five cards from lg */}
        <Stagger
          as="ol"
          gap={0.08}
          className="mt-10 rounded-[1.75rem] bg-white/[0.06] px-5 py-2 ring-1 ring-white/10 sm:mt-14 lg:grid lg:grid-cols-5 lg:gap-3 lg:bg-transparent lg:p-0 lg:ring-0"
        >
          {CYCLE.map((c, i) => (
            <Item
              as="li"
              key={c.label}
              className="flex items-start gap-4 border-b border-white/10 py-4 last:border-b-0 lg:block lg:rounded-[1.5rem] lg:border-b-0 lg:bg-white/[0.06] lg:p-6 lg:ring-1 lg:ring-white/10"
            >
              <p className="w-10 shrink-0 text-2xl font-extralight leading-none tabular-nums text-turquoise lg:w-auto lg:text-[2.75rem]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div className="lg:mt-6">
                <p className="text-lg font-semibold leading-tight">{c.label}</p>
                <p className="mt-1 text-sm text-white/70">{c.body}</p>
              </div>
            </Item>
          ))}
        </Stagger>

        {/* plans */}
        <Stagger as="ul" id="plans-b" gap={0.1} className="rail mt-12 grid gap-4 sm:mt-14 lg:grid-cols-3">
          {PLANS.map((p) => (
            <Item
              as="li"
              key={p.name}
              className={`flex flex-col rounded-[2rem] p-7 sm:p-8 ${p.featured ? "bg-turquoise text-sherpa-deep" : "bg-white/[0.06] ring-1 ring-white/10"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className={`text-title font-semibold ${p.featured ? "text-sherpa-deep" : "text-turquoise"}`}>{p.name}</p>
                {p.featured && (
                  <span className="shrink-0 rounded-full bg-sherpa-deep px-3 py-1 text-xs font-semibold text-turquoise">Recommended</span>
                )}
              </div>
              <p className="mt-6 text-headline font-normal">{p.price}</p>
              <p className={`mt-1 text-sm ${p.featured ? "text-sherpa-deep/70" : "text-white/65"}`}>{p.unit}</p>
              <ul
                className={`mt-6 space-y-2.5 border-t pt-5 text-sm ${p.featured ? "border-sherpa-deep/20" : "border-white/15 text-white/85"}`}
              >
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <Check
                      aria-hidden
                      className={`mt-0.5 size-4 shrink-0 ${p.featured ? "text-sherpa" : "text-turquoise"}`}
                      strokeWidth={2.4}
                    />
                    {pt}
                  </li>
                ))}
              </ul>
            </Item>
          ))}
        </Stagger>
        <RailDots railId="plans-b" labels={PLANS.map((p) => `${p.name} plan`)} tone="dark" />

        <Reveal className="mt-6 flex flex-col items-center justify-between gap-4 rounded-[2rem] bg-sherpa-deep p-7 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-title font-semibold">Not sure yet? Start with a pilot.</p>
            <p className="mt-1 text-white/70">One area. One application. See the ATP readings, then decide.</p>
          </div>
          <a href="#contact" className="btn shrink-0 rounded-full bg-turquoise px-6 py-3.5 font-semibold text-sherpa-deep hover:bg-white">
            Book a free assessment
          </a>
        </Reveal>
        <p className="mt-4 text-center text-sm text-white/55 sm:text-left">Indicative pricing, confirmed after your site assessment.</p>
      </div>
    </section>
  );
}
