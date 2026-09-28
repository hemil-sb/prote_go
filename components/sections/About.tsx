import Image from "next/image";
import { Eye, FlaskConical, Handshake, Leaf, ShieldCheck, type LucideIcon } from "lucide-react";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";

/*
  About us. Wording from the brand guide (mission, history, name meaning) and the
  brochures' "Our Promise", kept within the claims already used on the site.
*/
const TIMELINE = [
  {
    year: "2018",
    title: "Founded as BW Hygiene Services",
    body: "Pre-COVID, bringing tested, evidence-based sanitisation to its first clients.",
  },
  {
    year: "2024",
    title: "Became ProteGo Hygiene",
    body: "A holistic hygiene company: surface protection, auditing, training and application.",
  },
  {
    year: "Today",
    title: "Protecting spaces across India",
    body: "Hospitals, schools, offices, hotels and more, with every visit ATP verified.",
  },
];

const PROMISES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: ShieldCheck, title: "Safety first", body: "About 98% water. Non-flammable. Non-leaching." },
  { icon: FlaskConical, title: "Science backed", body: "Si-QAC nanotechnology, tested by an NABL-accredited lab." },
  { icon: Eye, title: "Transparent and honest", body: "ATP readings shared after every visit." },
  { icon: Handshake, title: "Partner for the long term", body: "We grow with you, protect with you and stand by you." },
  { icon: Leaf, title: "Sustainable by design", body: "Fewer applications. Lower chemical use." },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="plus-field bg-white" data-fade="tr">
      <div className="wrap py-14 sm:py-20 lg:py-28">
        {/* intro + name card */}
        <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="text-center lg:col-span-7 lg:text-left">
            <Reveal as="p" effect="fade" className="font-semibold text-orient">
              About us
            </Reveal>
            <Words id="about-title" text="Raising the bar on hygiene." className="mt-3 text-headline font-normal text-sherpa-deep" />
            <Reveal as="p" delay={0.2} className="mx-auto mt-6 max-w-[34rem] text-lede text-ink/75 lg:mx-0">
              ProteGo Hygiene exists for one clear reason: to raise the standards of hygiene in every space we serve. Advanced hygiene, made
              accessible, sustainable and measurable.
            </Reveal>
          </div>

          <Reveal
            delay={0.15}
            effect="right"
            className="on-dark relative overflow-hidden rounded-[2rem] bg-sherpa-deep p-7 text-white sm:p-9 lg:col-span-5"
          >
            <Image
              src="/brand/icon-teal.svg"
              alt=""
              width={205}
              height={226}
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-8 w-44 opacity-15"
            />
            <p className="text-sm font-semibold text-sherpa-tint">Our name</p>
            <p className="mt-4 text-[clamp(2.75rem,2rem+3vw,4.25rem)] font-light leading-none tracking-[-0.03em] text-turquoise">protego</p>
            <p className="mt-3 text-sm font-semibold text-white/70">Latin · &ldquo;to protect&rdquo;</p>
            <p className="mt-6 max-w-[24rem] text-white/85">A mark of our commitment to safeguarding your health and peace of mind.</p>
          </Reveal>
        </div>

        {/* timeline: vertical on phones, a row from lg */}
        <Stagger as="ol" gap={0.15} className="relative mt-12 grid gap-8 sm:mt-16 lg:grid-cols-3 lg:gap-10">
          {TIMELINE.map((t, i) => (
            <Item as="li" key={t.year} className="relative pl-8 lg:pl-0 lg:pt-10">
              {/* the line: down the left on phones, across the top from lg */}
              <span
                aria-hidden
                className={`absolute left-[7px] top-2 h-[calc(100%+2rem)] w-px bg-spring-deep lg:left-0 lg:top-[7px] lg:block lg:h-px ${
                  i === TIMELINE.length - 1 ? "hidden lg:w-full" : "lg:w-[calc(100%+2.5rem)]"
                }`}
              />
              <Item
                as="span"
                effect="pop"
                aria-hidden
                className={`absolute left-0 top-1 grid size-[15px] place-items-center rounded-full lg:top-0 ${
                  i === TIMELINE.length - 1 ? "bg-turquoise-deep" : "bg-orient"
                }`}
              >
                <span className="size-[5px] rounded-full bg-white" />
              </Item>
              <p className="text-title font-semibold text-orient">{t.year}</p>
              <p className="mt-2 text-lg font-semibold text-sherpa-deep">{t.title}</p>
              <p className="mt-1 max-w-[22rem] text-ink/65">{t.body}</p>
            </Item>
          ))}
        </Stagger>

        {/* our promise */}
        <div className="mt-14 sm:mt-20">
          <Reveal as="h3" className="text-center text-title font-semibold text-sherpa-deep lg:text-left">
            Our promise
          </Reveal>
          <Stagger as="ul" gap={0.07} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PROMISES.map(({ icon: Icon, title, body }) => (
              <Item
                as="li"
                key={title}
                className="group flex items-start gap-3 rounded-2xl border border-spring-deep bg-white p-4 transition-colors hover:border-orient/40 hover:bg-turquoise-tint/40 lg:block lg:p-5"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-turquoise-tint text-sherpa transition-[scale] duration-300 group-hover:scale-110">
                  <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                </span>
                <div className="lg:mt-4">
                  <p className="font-semibold leading-snug text-sherpa-deep">{title}</p>
                  <p className="mt-1 text-sm text-ink/60">{body}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
