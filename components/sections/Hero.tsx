import { CalendarCheck, Droplets, FlaskConical, Gauge } from "lucide-react";
import TouchTest from "@/components/TouchTest";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";

const PROOF = [
  { icon: CalendarCheck, label: "Up to 30 days" },
  { icon: FlaskConical, label: "NABL lab tested" },
  { icon: Gauge, label: "ATP verified" },
  { icon: Droplets, label: "~98% water" },
];

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="plus-field" data-fade="tr">
      <div className="wrap pb-14 pt-8 sm:pb-20 sm:pt-16 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="text-center lg:col-span-6 lg:text-left">
            <Words
              as="h1"
              onMount
              gap={0.09}
              delay={0.15}
              id="hero-title"
              text="Protection that doesn’t sleep."
              className="text-display font-normal text-sherpa-deep"
            />
            <Stagger onMount delay={0.55} gap={0.1}>
              <Item as="p" className="mx-auto mt-6 max-w-[30rem] text-lede text-ink/75 sm:mt-7 lg:mx-0">
                Disinfectants stop working once they dry. ProteGo keeps surfaces protected for up to 30 days, touch after touch.
              </Item>
              <Item className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-9 sm:gap-4 lg:justify-start">
                <a href="#contact" className="rounded-full bg-orient px-7 py-4 font-semibold text-white btn hover:bg-sherpa">
                  Book a free assessment
                </a>
                <a
                  href="#cleaning-gap"
                  className="rounded-full border border-sherpa-deep/25 px-7 py-4 font-semibold text-sherpa-deep btn hover:border-sherpa-deep"
                >
                  See the difference
                </a>
              </Item>
              <ul className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-3 sm:mt-12 sm:gap-x-7 sm:gap-y-4 lg:mx-0 lg:justify-start">
                {PROOF.map(({ icon: Icon, label }) => (
                  <Item as="li" key={label} effect="left" className="flex items-center gap-2.5 text-sm font-semibold text-sherpa-deep">
                    <Icon aria-hidden className="size-5 shrink-0 text-orient" strokeWidth={1.6} />
                    {label}
                  </Item>
                ))}
              </ul>
            </Stagger>
          </div>

          <Reveal onMount effect="right" delay={0.45} duration={1} className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
            <TouchTest />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
