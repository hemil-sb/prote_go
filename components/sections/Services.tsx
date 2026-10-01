import Link from "next/link";
import { Check, ClipboardCheck, FlaskConical, GraduationCap, ShieldCheck } from "lucide-react";
import { INCLUDED, PLANS } from "@/content/plans";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";
import RailDots from "@/components/RailDots";
import ExploreLink from "@/components/site/ExploreLink";
import { IconBadge, PLAN_ICONS } from "@/components/site/icons";
import { AtpReadingMock, CertificateMock, DigitalReportMock, LifecycleDiagram } from "@/components/ServiceVisuals";

const EXTRAS = [
  { icon: ClipboardCheck, label: "Hygiene audits" },
  { icon: GraduationCap, label: "Staff training" },
  { icon: ShieldCheck, label: "Compliance support" },
];

/* The managed programme card: checklist beside the 30-day lifecycle ring (design A). */
export function ProgrammeCard({ className = "" }: { className?: string }) {
  return (
    <Reveal className={`on-dark grid items-center gap-10 rounded-[2rem] bg-sherpa-deep p-6 text-white sm:p-12 lg:grid-cols-2 ${className}`}>
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
  );
}

/* What the client sees after every visit. */
export function ProofCards({ className = "" }: { className?: string }) {
  return (
    <>
      <Stagger id="service-proof" gap={0.12} className={`rail grid gap-6 lg:grid-cols-3 ${className}`}>
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
          className="m-0 flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-white px-5 py-7 sm:gap-8 sm:px-6 sm:py-10"
        >
          <DigitalReportMock />
          <figcaption className="text-center">
            <p className="font-semibold text-sherpa-deep">Digital reports</p>
            <p className="mt-1 text-sm text-ink/60">Results, trends and recommendations.</p>
          </figcaption>
        </Item>
      </Stagger>
      <RailDots railId="service-proof" labels={["ATP testing", "Protected Space certificate", "Digital reports"]} />
    </>
  );
}

export function Extras({ className = "" }: { className?: string }) {
  return (
    <Stagger as="ul" gap={0.08} className={`grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3 ${className}`}>
      <Item as="li" effect="fade" className="col-span-3 mb-1 text-center text-sm font-semibold text-ink/60 sm:mb-0 sm:mr-2 sm:text-left">
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
  );
}

export function Plans({ className = "" }: { className?: string }) {
  return (
    <>
      <Stagger as="ul" id="plans-b" gap={0.12} className={`rail grid gap-6 lg:grid-cols-3 ${className}`}>
        {PLANS.map((p) => (
          <Item
            as="li"
            key={p.name}
            className={`flex flex-col rounded-[2rem] p-6 transition-shadow duration-300 hover:shadow-[0_24px_48px_-24px_rgb(13_44_51/0.35)] sm:p-8 ${p.featured ? "on-dark bg-sherpa text-white" : "border border-spring-deep bg-white"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <IconBadge icon={PLAN_ICONS[p.name] ?? ShieldCheck} tone={p.featured ? "turquoise" : "deep"} size="sm" />
                <p className={`text-title font-semibold ${p.featured ? "text-turquoise" : "text-orient"}`}>{p.name}</p>
              </div>
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
      <RailDots railId="plans-b" labels={PLANS.map((p) => `${p.name} plan`)} />
    </>
  );
}

export function PilotBanner({ className = "" }: { className?: string }) {
  return (
    <Reveal
      className={`flex flex-col items-center justify-between gap-5 rounded-[2rem] bg-turquoise-tint p-6 text-center sm:flex-row sm:p-8 sm:text-left ${className}`}
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <IconBadge icon={FlaskConical} />
        <div>
          <p className="text-title font-semibold text-sherpa-deep">Not sure yet? Start with a pilot.</p>
          <p className="mt-1 text-ink/70">One area. One application. See the ATP readings, then decide.</p>
        </div>
      </div>
      <Link href="/contact" className="btn shrink-0 rounded-full bg-orient px-6 py-3.5 font-semibold text-white hover:bg-sherpa">
        Book a pilot
      </Link>
    </Reveal>
  );
}

export const PRICING_NOTE = "Indicative pricing, confirmed after your site assessment.";

/* Home page teaser: the programme card only, linking to /services for proof, plans and pilots. */
export default function Services() {
  return (
    <section id="service" aria-labelledby="service-title" className="plus-field bg-spring" data-fade="tl">
      <div className="wrap py-16 sm:py-24 lg:py-28">
        <div className="grid gap-6 text-center lg:grid-cols-12 lg:items-end lg:text-left">
          <Words id="service-title" text="Services." className="text-headline font-normal text-sherpa-deep lg:col-span-6" />
          <Reveal as="p" delay={0.2} className="mx-auto max-w-[28rem] text-lede text-ink/75 lg:col-span-5 lg:col-start-8 lg:mx-0">
            Science-backed. Independently tested. Professionally delivered.
          </Reveal>
        </div>
        <ProgrammeCard className="mt-8 sm:mt-12" />
        <Reveal className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
          <ExploreLink href="/services">Explore plans and pricing</ExploreLink>
          <ExploreLink href="/contact" tone="outline">
            Start a pilot
          </ExploreLink>
        </Reveal>
      </div>
    </section>
  );
}
