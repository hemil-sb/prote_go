import { Check, ClipboardCheck, GraduationCap, ShieldCheck } from "lucide-react";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";
import RailDots from "@/components/RailDots";
import { AtpReadingMock, CertificateMock, DigitalReportMock, LifecycleDiagram } from "@/components/ServiceVisuals";

// Inclusions of the Professional Protection Programme (Gyms, Retail, Pharma briefs)
const INCLUDED = [
  "Site assessment and surface mapping",
  "Professional ULV application",
  "ATP testing before and after",
  "Digital hygiene report",
  "Protected Space™ certification",
  "Renewal every 30 days",
];

// Programme tiers as named in the Gyms and Retail briefs
const PLANS = [
  {
    name: "Professional",
    price: "From ₹2.75",
    unit: "per sq ft a month + GST",
    points: ["Everything in the managed programme", "From 1,500 sq ft", "Minimum 6 months"],
  },
  {
    name: "12-Month",
    price: "Preferential",
    unit: "annual terms",
    points: ["Everything in Professional", "Annual plan and trend reports", "Dedicated account manager"],
    featured: true,
  },
  {
    name: "Long-Term Partnership",
    price: "Custom",
    unit: "proposal",
    points: ["Chains, campuses, developers", "One standard across every site", "Portfolio-wide reporting"],
  },
];

const EXTRAS = [
  { icon: ClipboardCheck, label: "Hygiene audits" },
  { icon: GraduationCap, label: "Staff training" },
  { icon: ShieldCheck, label: "Compliance support" },
];

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="plus-field" data-fade="tl">
      <div className="wrap py-14 sm:py-20 lg:py-28">
        <div className="grid gap-6 text-center lg:grid-cols-12 lg:items-end lg:text-left">
          <Words id="services-title" text="Services." className="text-headline font-normal text-sherpa-deep lg:col-span-6" />
          <Reveal as="p" delay={0.2} className="mx-auto max-w-[28rem] text-lede text-ink/75 lg:col-span-5 lg:col-start-8 lg:mx-0">
            Science-backed. Independently tested. Professionally delivered.
          </Reveal>
        </div>

        {/* 1. Core service */}
        <Reveal className="on-dark mt-8 sm:mt-12 grid items-center gap-10 rounded-[2rem] bg-sherpa-deep p-6 text-white sm:p-12 lg:grid-cols-2">
          <div>
            <p className="font-semibold text-turquoise">Managed Protection Programme</p>
            <h3 className="mt-3 text-headline font-normal">We apply it. We prove it. We renew it.</h3>
            <Stagger as="ul" delay={0.3} gap={0.08} className="mt-8 grid gap-3 sm:grid-cols-2">
              {INCLUDED.map((item) => (
                <Item as="li" key={item} effect="left" className="flex items-start gap-2.5 text-white/85">
                  <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-turquoise" strokeWidth={2.2} />
                  {item}
                </Item>
              ))}
            </Stagger>
          </div>
          <LifecycleDiagram />
        </Reveal>

        {/* 2. What you see */}
        <Stagger id="service-proof" gap={0.12} className="rail mt-6 grid gap-6 lg:grid-cols-3">
          <Item
            as="figure"
            className="m-0 flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-white px-5 py-7 sm:gap-8 sm:px-6 sm:py-10"
          >
            <AtpReadingMock />
            <figcaption className="text-center">
              <p className="font-semibold text-sherpa-deep">ATP testing</p>
              <p className="mt-1 text-sm text-ink/60">Proof after every visit.</p>
            </figcaption>
          </Item>
          <Item
            as="figure"
            className="m-0 flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-turquoise-tint px-5 py-7 sm:gap-8 sm:px-6 sm:py-10"
          >
            <CertificateMock />
            <figcaption className="text-center">
              <p className="font-semibold text-sherpa-deep">Protected Space&trade;</p>
              <p className="mt-1 text-sm text-ink/60">A certificate your visitors can see and scan.</p>
            </figcaption>
          </Item>
          <Item
            as="figure"
            className="m-0 flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-panel px-5 py-7 sm:gap-8 sm:px-6 sm:py-10"
          >
            <DigitalReportMock />
            <figcaption className="text-center">
              <p className="font-semibold text-sherpa-deep">Digital reports</p>
              <p className="mt-1 text-sm text-ink/60">Results, trends and recommendations.</p>
            </figcaption>
          </Item>
        </Stagger>
        <RailDots railId="service-proof" labels={["ATP testing", "Protected Space certificate", "Digital reports"]} />

        {/* extras: three even tiles on phones, a row of pills from sm up */}
        <Stagger as="ul" gap={0.08} className="mt-8 grid grid-cols-3 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <Item
            as="li"
            effect="fade"
            className="col-span-3 mb-1 text-center text-sm font-semibold text-ink/60 sm:mb-0 sm:mr-2 sm:text-left"
          >
            Also available
          </Item>
          {EXTRAS.map(({ icon: Icon, label }) => (
            <Item
              as="li"
              key={label}
              effect="pop"
              className="flex flex-col items-center gap-2 rounded-2xl border border-spring-deep bg-white px-2 py-3.5 text-center text-xs font-semibold leading-tight text-sherpa-deep sm:flex-row sm:rounded-full sm:px-4 sm:py-2 sm:text-left sm:text-sm"
            >
              <Icon aria-hidden className="size-5 text-orient sm:size-4" strokeWidth={1.8} />
              {label}
            </Item>
          ))}
        </Stagger>

        {/* 3. Programmes */}
        <div className="mt-14 sm:mt-20">
          <Reveal as="h3" className="text-center text-title font-semibold text-sherpa-deep lg:text-left">
            Choose your protection programme
          </Reveal>
          <Stagger as="ul" id="plans" gap={0.12} className="rail mt-6 grid gap-6 sm:mt-8 lg:grid-cols-3">
            {PLANS.map((p) => (
              <Item
                as="li"
                key={p.name}
                className={`flex flex-col rounded-[2rem] p-6 sm:p-8 transition-shadow duration-300 hover:shadow-[0_24px_48px_-24px_rgb(13_44_51/0.35)] ${p.featured ? "on-dark bg-sherpa text-white" : "border border-spring-deep bg-white"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className={`text-title font-semibold ${p.featured ? "text-turquoise" : "text-orient"}`}>{p.name}</p>
                  {p.featured && (
                    <span className="shrink-0 rounded-full bg-turquoise px-3 py-1 text-xs font-semibold text-sherpa-deep">Recommended</span>
                  )}
                </div>
                <p className={`mt-4 text-headline font-normal sm:mt-6 ${p.featured ? "text-white" : "text-sherpa-deep"}`}>{p.price}</p>
                <p className={`mt-1 text-sm ${p.featured ? "text-white/70" : "text-ink/60"}`}>{p.unit}</p>
                <ul
                  className={`mt-6 space-y-3 border-t pt-5 text-sm sm:mt-8 sm:pt-6 ${p.featured ? "border-white/20 text-white/85" : "border-spring-deep text-ink/75"}`}
                >
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5">
                      <Check
                        aria-hidden
                        className={`mt-0.5 size-4 shrink-0 ${p.featured ? "text-turquoise" : "text-orient"}`}
                        strokeWidth={2.4}
                      />
                      {pt}
                    </li>
                  ))}
                </ul>
              </Item>
            ))}
          </Stagger>
          <RailDots railId="plans" labels={PLANS.map((p) => `${p.name} plan`)} />

          <Reveal className="mt-6 flex flex-col items-center justify-between gap-5 rounded-[2rem] bg-turquoise-tint p-6 text-center sm:flex-row sm:p-8 sm:text-left">
            <div>
              <p className="text-title font-semibold text-sherpa-deep">Not sure yet? Start with a pilot.</p>
              <p className="mt-1 text-ink/70">One area. One application. See the ATP readings, then decide.</p>
            </div>
            <a href="#contact" className="shrink-0 rounded-full bg-orient px-6 py-3.5 font-semibold text-white btn hover:bg-sherpa">
              Book a free assessment
            </a>
          </Reveal>
          <p className="mt-4 text-center text-sm text-ink/55 sm:text-left">Indicative pricing, confirmed after your site assessment.</p>
        </div>
      </div>
    </section>
  );
}
