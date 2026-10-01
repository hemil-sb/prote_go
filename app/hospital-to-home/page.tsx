import type { Metadata } from "next";
import { ClipboardList, Gauge, HeartPulse, Hospital, Lock } from "lucide-react";
import { conditionIcon, Glyph, IconBadge, pointIcon, stepIcon, surfaceIcon, zoneIcon } from "@/components/site/icons";
import PageHero from "@/components/site/PageHero";
import SectionIntro from "@/components/site/SectionIntro";
import CtaBand from "@/components/site/CtaBand";
import Faq from "@/components/sections/Faq";
import { Item, Reveal, Stagger } from "@/components/Motion";
import { H2H } from "@/content/hospital-to-home";

export const metadata: Metadata = {
  title: "Hospital to Home™",
  description: H2H.lede,
};

export default function HospitalToHomePage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
          { href: "/hospital-to-home", label: "Hospital to Home™" },
        ]}
        title={H2H.headline}
        lede="A structured surface-protection programme for people coming home after hospital treatment."
        actions={[
          { href: "/contact?sector=Home%20or%20residential", label: "Talk to us about a home visit" },
          { href: "#visit", label: "How a visit works" },
        ]}
        highlights={[
          { icon: HeartPulse, value: "After discharge", label: "for recovering patients" },
          { icon: ClipboardList, value: "Planned with you", label: "room by room" },
          { icon: Gauge, value: "ATP readings", label: "before and after" },
        ]}
        image={{ src: "/images/caregiver-elderly.jpg", alt: "A caregiver supporting an elderly person as they walk" }}
        card={{ icon: Lock, title: "Consent first", text: "We arrange a visit only with the patient's or family's agreement." }}
      />

      {/* why */}
      <section aria-labelledby="why-title" className="plus-field bg-spring" data-fade="tl">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <SectionIntro id="why-title" title={H2H.why.title} lede={H2H.why.intro} />
          <Stagger as="ul" gap={0.1} className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {H2H.why.points.map((p) => (
              <Item as="li" key={p.title} className="rounded-[2rem] bg-white p-7">
                <IconBadge icon={pointIcon(p.title)} />
                <p className="mt-6 text-title font-semibold text-sherpa-deep">{p.title}</p>
                <p className="mt-3 text-ink/70">{p.body}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* who it's for + touchpoints */}
      <section aria-labelledby="who-title" className="bg-white">
        <div className="wrap grid gap-6 py-16 sm:py-24 lg:grid-cols-12 lg:py-28">
          <Reveal className="on-dark rounded-[2rem] bg-sherpa-deep p-7 text-white sm:p-10 lg:col-span-5">
            <h2 id="who-title" className="text-headline font-normal text-turquoise">
              Who it&rsquo;s for.
            </h2>
            <ul className="mt-8 space-y-3.5">
              {H2H.whoFor.map((w) => (
                <li key={w} className="flex items-center gap-3.5 text-white/85">
                  <IconBadge icon={conditionIcon(w)} tone="glass" size="sm" />
                  {w}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="lg:col-span-7">
            <h2 className="text-center text-headline font-normal text-sherpa-deep lg:text-left">What we protect.</h2>
            <Stagger as="ul" gap={0.08} className="mt-8 grid gap-3 sm:grid-cols-2">
              {H2H.touchpoints.map((t) => (
                <Item as="li" key={t.area} className="rounded-[1.75rem] bg-turquoise-tint p-6">
                  <p className="flex items-center gap-3 font-semibold text-sherpa-deep">
                    <IconBadge icon={zoneIcon(t.area)} size="sm" />
                    {t.area}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {t.surfaces.map((s) => (
                      <li key={s} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm text-sherpa-deep">
                        <Glyph icon={surfaceIcon(s)} className="size-3.5 text-orient" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </Item>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* the visit */}
      <section id="visit" aria-labelledby="visit-title" className="on-dark plus-field bg-sherpa text-white" data-tone="dark" data-fade="br">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <SectionIntro id="visit-title" dark title="How a home visit works." lede={H2H.line} />
          <Stagger as="ol" gap={0.1} className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {H2H.steps.map((s, i) => (
              <Item as="li" key={s.title} className="rounded-[1.75rem] bg-white/[0.06] p-6 ring-1 ring-white/10">
                <div className="flex items-center justify-between">
                  <IconBadge icon={stepIcon(s.title)} tone="turquoise" size="sm" />
                  <span className="text-sm font-semibold tabular-nums text-white/50">Step {i + 1}</span>
                </div>
                <p className="mt-5 text-lg font-semibold">{s.title}</p>
                <p className="mt-2 text-sm text-white/75">{s.body}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* partners + privacy */}
      <section aria-labelledby="partners-title" className="bg-spring">
        <div className="wrap grid gap-6 py-16 sm:py-24 lg:grid-cols-2">
          <Reveal className="rounded-[2rem] bg-white p-7 sm:p-10">
            <IconBadge icon={Hospital} />
            <p className="mt-6 text-sm font-semibold text-orient">For hospitals and clinicians</p>
            <h2 id="partners-title" className="mt-3 text-headline font-normal text-sherpa-deep">
              {H2H.partners.title}
            </h2>
            <p className="mt-4 text-ink/75">{H2H.partners.body}</p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-[2rem] bg-turquoise-tint p-7 sm:p-10">
            <IconBadge icon={Lock} />
            <h2 className="mt-6 text-title font-semibold text-sherpa-deep">Your family&rsquo;s privacy</h2>
            <p className="mt-3 text-ink/75">{H2H.privacy}</p>
          </Reveal>
        </div>
      </section>

      <Faq items={H2H.faqs} id="h2h-faq" tone="white" />
      <CtaBand
        title="Planning a discharge?"
        body="Talk to us about a home visit. We'll explain what's involved and arrange it around your family."
        primary={{ href: "/contact?sector=Home%20or%20residential", label: "Talk to us about a home visit" }}
        secondary={null}
      />
    </>
  );
}
