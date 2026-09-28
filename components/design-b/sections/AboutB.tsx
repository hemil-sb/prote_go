import Image from "next/image";
import { Eye, FlaskConical, Handshake, Leaf, ShieldCheck, type LucideIcon } from "lucide-react";
import { Item, Stagger, Words } from "@/components/Motion";

/* About, from the brand guide (mission, history, name) and the brochures' "Our Promise". Same wording as design A. */
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

export default function AboutB() {
  return (
    <section id="about" aria-labelledby="about-b-title" className="bg-spring py-16 sm:py-24 lg:py-28">
      <div className="wrap">
        <Stagger gap={0.12} className="grid gap-4 xl:grid-cols-12">
          {/* mission and name */}
          <Item
            as="article"
            className="on-dark relative flex flex-col justify-between gap-10 overflow-hidden rounded-[2rem] bg-sherpa-deep p-8 text-center text-white sm:p-10 xl:col-span-7 xl:text-left"
          >
            <Image
              src="/brand/icon-teal.svg"
              alt=""
              width={205}
              height={226}
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-10 w-56 opacity-10"
            />
            <div>
              <p className="text-sm font-semibold tabular-nums text-turquoise">About</p>
              <Words id="about-b-title" text="Raising the bar on hygiene." className="mt-3 text-headline font-normal" />
              <p className="mx-auto mt-5 max-w-[34rem] text-lede text-white/80 xl:mx-0">
                ProteGo Hygiene exists for one clear reason: to raise the standards of hygiene in every space we serve. Advanced hygiene,
                made accessible, sustainable and measurable.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 border-t border-white/15 pt-8 sm:flex-row sm:items-end sm:justify-between xl:items-end">
              <div>
                <p className="text-[clamp(2.75rem,2rem+3vw,4.25rem)] font-light leading-none tracking-[-0.03em] text-turquoise">protego</p>
                <p className="mt-2 text-sm font-semibold text-white/70">Latin · &ldquo;to protect&rdquo;</p>
              </div>
              <p className="max-w-[18rem] text-sm text-white/75 sm:text-right">
                A mark of our commitment to safeguarding your health and peace of mind.
              </p>
            </div>
          </Item>

          {/* history */}
          <Item as="article" className="rounded-[2rem] bg-white p-8 ring-1 ring-spring-deep sm:p-10 xl:col-span-5">
            <p className="text-center text-sm font-semibold text-orient xl:text-left">Our story</p>
            <ol className="mt-6">
              {TIMELINE.map((t, i) => (
                <li key={t.year} className="relative pb-7 pl-8 last:pb-0">
                  {i < TIMELINE.length - 1 && <span aria-hidden className="absolute left-[7px] top-4 h-full w-px bg-spring-deep" />}
                  <span
                    aria-hidden
                    className={`absolute left-0 top-1 grid size-[15px] place-items-center rounded-full ${i === TIMELINE.length - 1 ? "bg-turquoise-deep" : "bg-orient"}`}
                  >
                    <span className="size-[5px] rounded-full bg-white" />
                  </span>
                  <p className="text-title font-semibold leading-none text-orient">{t.year}</p>
                  <p className="mt-2 font-semibold text-sherpa-deep">{t.title}</p>
                  <p className="mt-1 text-sm text-ink/65">{t.body}</p>
                </li>
              ))}
            </ol>
          </Item>
        </Stagger>

        {/* our promise */}
        <p className="mt-12 text-center text-title font-semibold text-sherpa-deep xl:text-left">Our promise</p>
        <Stagger as="ul" gap={0.07} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PROMISES.map(({ icon: Icon, title, body }) => (
            <Item
              as="li"
              key={title}
              className="group flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-spring-deep transition-colors hover:bg-turquoise-tint/50 lg:block lg:p-5"
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
    </section>
  );
}
