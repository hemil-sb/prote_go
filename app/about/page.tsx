import type { Metadata } from "next";
import { Building2, FlaskConical, HeartHandshake, Leaf, MapPin, Sprout, Users } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import SectionIntro from "@/components/site/SectionIntro";
import CtaBand from "@/components/site/CtaBand";
import About from "@/components/sections/About";
import Clients from "@/components/sections/Clients";
import { Item, Stagger } from "@/components/Motion";

export const metadata: Metadata = {
  title: "About us",
  description:
    "ProteGo Hygiene, founded in 2018 as BW Hygiene Services, is a holistic hygiene solutions company raising the standards of hygiene in every space it serves.",
};

// Brand guide values, verbatim lines
const VALUES = [
  { icon: HeartHandshake, title: "Care, integrity and trust", body: "We lead with empathy and act responsibly in everything we do." },
  { icon: Sprout, title: "Commitment to growth", body: "Excellence is a journey. We're always evolving." },
  { icon: Users, title: "A trusted partner", body: "Beyond products, we offer dependable support and collaboration." },
  { icon: Leaf, title: "Seamless hygiene", body: "Hygiene should feel natural: effortless, intuitive and part of daily life." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About us" },
        ]}
        title="Raising the bar on hygiene."
        lede="We exist to raise the standards of hygiene in every space we serve, through science-backed innovation, meticulous implementation and client-specific customisation."
        actions={[
          { href: "#about", label: "Read our story" },
          { href: "/contact", label: "Talk to us" },
        ]}
        highlights={[
          { icon: MapPin, value: "Navi Mumbai", label: "headquarters" },
          { icon: Building2, value: "15 industries", label: "served" },
          { icon: FlaskConical, value: "Independently tested", label: "NABL-accredited lab" },
        ]}
      />
      <About />

      <section aria-labelledby="values-title" className="plus-field bg-spring" data-fade="bl">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <SectionIntro
            id="values-title"
            eyebrow="Our values"
            title="What guides us."
            lede="Our values shape everything we do, from the products we create to the relationships we build."
          />
          <Stagger as="ul" gap={0.08} className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <Item as="li" key={title} className="rounded-[2rem] bg-white p-7">
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

      <Clients quoteOnly />
      <CtaBand
        tone="white"
        title="Partner with us."
        body="From a single site to a whole portfolio, we'll help you raise the standard of hygiene in every space."
        secondary={{ href: "/industries", label: "Industries we serve" }}
      />
    </>
  );
}
