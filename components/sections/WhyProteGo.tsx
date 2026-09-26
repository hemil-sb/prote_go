import { CalendarCheck, Clock, Droplets, Flame, FlaskConical, Gauge, Layers, RotateCw, type LucideIcon } from "lucide-react";
import { Item, Stagger, Words } from "@/components/Motion";

const BADGES: { icon: LucideIcon; title: string; note: string; crossed?: boolean }[] = [
  { icon: CalendarCheck, title: "Up to 30 days", note: "per application" },
  { icon: RotateCw, title: "Works between cleans", note: "not instead of them" },
  { icon: Droplets, title: "~98% water", note: "water-based formula" },
  { icon: Layers, title: "Non-leaching", note: "stays on the surface" },
  { icon: Flame, title: "Non-flammable", note: "safe to apply indoors", crossed: true },
  { icon: FlaskConical, title: "NABL lab tested", note: "independent efficacy testing" },
  { icon: Gauge, title: "ATP verified", note: "proof after every visit" },
  { icon: Clock, title: "About 1 hour", note: "to dry and reopen" },
];

export default function WhyProteGo() {
  return (
    <section aria-labelledby="why-title" className="plus-field" data-fade="bl">
      <div className="wrap py-14 sm:py-20 lg:py-28">
        <div className="grid gap-6 text-center lg:grid-cols-12 lg:items-end lg:text-left">
          <Words
            id="why-title"
            text="Protect once. Clean as usual. Measurable every time."
            className="text-headline font-normal text-sherpa-deep lg:col-span-9"
          />
        </div>

        <Stagger
          as="ul"
          gap={0.07}
          className="mt-8 grid grid-cols-2 gap-px sm:mt-12 overflow-hidden rounded-[1.5rem] border border-spring-deep bg-spring-deep lg:grid-cols-4"
        >
          {BADGES.map(({ icon: Icon, title, note, crossed }) => (
            <Item
              as="li"
              key={title}
              effect="fade"
              className="group bg-white px-3 py-5 text-center transition-colors hover:bg-turquoise-tint/50 sm:p-8 sm:text-left"
            >
              <Item
                as="span"
                effect="pop"
                className="relative mx-auto grid size-10 shrink-0 place-items-center rounded-full bg-turquoise-tint text-sherpa transition-[scale,background-color] duration-300 group-hover:scale-110 group-hover:bg-turquoise sm:mx-0 sm:size-14"
              >
                <Icon aria-hidden className="size-5 sm:size-7" strokeWidth={1.5} />
                {crossed && <span aria-hidden className="absolute h-0.5 w-6 rotate-45 rounded-full bg-sherpa sm:w-9" />}
              </Item>
              <div className="mt-3 sm:mt-6">
                <p className="text-sm font-semibold leading-snug text-sherpa-deep sm:text-lg">{title}</p>
                <p className="mt-0.5 text-xs text-ink/60 sm:mt-1 sm:text-sm">{note}</p>
              </div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
