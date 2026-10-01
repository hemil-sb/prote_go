import type { Metadata } from "next";
import { Atom, Clock, Gauge, Layers, Magnet, ShieldCheck } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import SectionIntro from "@/components/site/SectionIntro";
import CtaBand from "@/components/site/CtaBand";
import CleaningGap from "@/components/sections/CleaningGap";
import HowItWorks from "@/components/sections/HowItWorks";
import Faq from "@/components/sections/Faq";
import { AtpReadingMock } from "@/components/ServiceVisuals";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Disinfectants stop working once they dry. ProteGo's Si-QAC layer bonds to the surface and keeps working between cleans for up to 30 days, verified with ATP testing.",
};

const SCIENCE = [
  {
    icon: Layers,
    title: "It bonds",
    body: "Si-QAC is a silane-bonded quaternary ammonium compound. Once applied, it forms an invisible layer that bonds to the surface instead of evaporating.",
  },
  {
    icon: Magnet,
    title: "It stays active",
    body: "The layer carries positive charges that disrupt microbes on contact, touch after touch, between cleans.",
  },
  {
    icon: ShieldCheck,
    title: "It stays put",
    body: "It is non-leaching and non-flammable, so the layer stays on the surface where it was applied.",
  },
];

const RLU_BANDS = [
  { range: "0–30 RLU", label: "Excellent", tone: "bg-turquoise" },
  { range: "31–100 RLU", label: "Acceptable", tone: "bg-sherpa-tint" },
  { range: "Above 100 RLU", label: "Needs attention", tone: "bg-spring-deep" },
];

const SCIENCE_FAQS = [
  { q: "Does it replace cleaning?", a: "No. Clean as usual. ProteGo complements routine cleaning by protecting surfaces in between." },
  {
    q: "Which surfaces can be treated?",
    a: "Hard, non-food-contact, high-touch surfaces: door handles, lift buttons, handrails, desks, counters, switches and the like.",
  },
  { q: "How has it been tested?", a: "Its efficacy has been tested by an NABL-accredited laboratory." },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/how-it-works", label: "How it works" },
        ]}
        title="Protection that doesn't sleep."
        lede="Ordinary disinfectants stop working once they dry. ProteGo leaves a bonded antimicrobial layer that keeps working between cleans."
        actions={[
          { href: "/contact", label: "Book a free assessment" },
          { href: "/products", label: "See the products" },
        ]}
        highlights={[
          { icon: Clock, value: "Up to 30 days", label: "per application" },
          { icon: Layers, value: "Bonded layer", label: "stays on the surface" },
          { icon: Gauge, value: "ATP verified", label: "before and after" },
        ]}
        image={{ src: "/images/molecule.jpg", alt: "White molecule models floating against a soft blue-grey background" }}
        card={{
          icon: Atom,
          title: "Si-QAC nanotechnology",
          text: "A silane-bonded quaternary ammonium compound that bonds to the surface.",
        }}
      />

      <CleaningGap />
      <HowItWorks />

      {/* the science */}
      <section aria-labelledby="science-title" className="plus-field bg-spring" data-fade="tr">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <SectionIntro
            id="science-title"
            eyebrow="Si-QAC nanotechnology"
            title="The science, simply."
            lede="A protectant that bonds, rather than a disinfectant that evaporates."
          />
          <Stagger as="ul" gap={0.1} className="mt-10 grid gap-4 sm:mt-14 md:grid-cols-3 lg:gap-6">
            {SCIENCE.map(({ icon: Icon, title, body }) => (
              <Item as="li" key={title} className="rounded-[2rem] bg-white p-7 sm:p-8">
                <span className="grid size-12 place-items-center rounded-2xl bg-sherpa-deep text-turquoise">
                  <Icon aria-hidden className="size-6" strokeWidth={1.6} />
                </span>
                <p className="mt-6 text-title font-semibold text-sherpa-deep">{title}</p>
                <p className="mt-2 text-ink/70">{body}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ATP verification */}
      <section aria-labelledby="atp-title" className="bg-white">
        <div className="wrap grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-12 lg:gap-16 lg:py-28">
          <div className="text-center lg:col-span-6 lg:text-left">
            <p className="text-sm font-semibold text-orient">ATP verification</p>
            <Words id="atp-title" text="What gets measured gets trusted." className="mt-3 text-headline font-normal text-sherpa-deep" />
            <Reveal as="p" delay={0.15} className="mx-auto mt-6 max-w-[34rem] text-lede text-ink/75 lg:mx-0">
              Clean can&rsquo;t be seen, but it can be measured. We swab high-touch surfaces before and after every application and read
              them on site in Relative Light Units (RLU). Lower is cleaner.
            </Reveal>
            <Stagger as="ul" gap={0.08} className="mx-auto mt-8 max-w-[30rem] space-y-2 text-left lg:mx-0">
              {RLU_BANDS.map((b) => (
                <Item as="li" key={b.range} effect="left" className="flex items-center gap-4 rounded-2xl bg-spring px-5 py-3.5">
                  <span aria-hidden className={`size-3 shrink-0 rounded-full ${b.tone}`} />
                  <span className="w-32 font-semibold text-sherpa-deep">{b.range}</span>
                  <span className="text-ink/70">{b.label}</span>
                </Item>
              ))}
            </Stagger>
            <p className="mt-4 text-sm text-ink/55">
              ATP measures organic residue, a cleanliness indicator, not a count of microbes. Bands are ProteGo&rsquo;s own guide.
            </p>
          </div>
          <Reveal effect="zoom" className="flex justify-center rounded-[2rem] bg-turquoise-tint px-6 py-12 lg:col-span-6">
            <AtpReadingMock />
          </Reveal>
        </div>
      </section>

      <Faq items={SCIENCE_FAQS} id="science-faq" />
      <CtaBand
        tone="white"
        title="See it on your own surfaces."
        body="Book a free assessment and we'll take ATP readings on your high-touch surfaces, then suggest a plan."
        secondary={{ href: "/products", label: "Explore products" }}
      />
    </>
  );
}
