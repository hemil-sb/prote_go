import Image from "next/image";
import { CalendarCheck, Droplets, FlaskConical, Gauge } from "lucide-react";
import { Item, Stagger, Words } from "@/components/Motion";

const PROOF = [
  { icon: CalendarCheck, label: "Up to 30 days" },
  { icon: FlaskConical, label: "NABL lab tested" },
  { icon: Gauge, label: "ATP verified" },
  { icon: Droplets, label: "~98% water" },
];

/*
  Hero, direction 1: the brand's own campaign photo, full bleed.
  The worker and the "1 Spray · 30 days" petal sit on the left of the photo; the calm
  window on the right carries the headline. On phones the photo sits on top and fades
  into the teal, with the text below.
*/
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-sherpa-deep text-white">
      {/* photo: its own block on phones, full bleed behind the text from lg */}
      <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
        <Image
          src="/images/campaign-one-spray-30-days.jpg"
          alt="A café worker sprays a table with ProteGo Surface Protectant."
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="hero-settle object-cover object-[18%_50%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-sherpa-deep via-sherpa-deep/10 via-40% to-transparent lg:bg-gradient-to-l lg:from-sherpa-deep/95 lg:via-sherpa-deep/65 lg:via-40% lg:to-transparent lg:to-70%"
        />
      </div>

      <div className="wrap relative lg:grid lg:min-h-[min(calc(100svh-5rem),50rem)] lg:grid-cols-12 lg:items-center">
        <div className="-mt-6 pb-14 text-center sm:-mt-12 sm:pb-20 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:py-24 lg:text-left xl:col-span-5 xl:col-start-8">
          <Words
            as="h1"
            onMount
            gap={0.09}
            delay={0.2}
            id="hero-title"
            text="Protection that doesn’t sleep."
            className="text-display font-normal text-white"
          />
          <Stagger onMount delay={0.6} gap={0.1}>
            <Item as="p" className="mx-auto mt-6 max-w-[30rem] text-lede text-white/80 sm:mt-7 lg:mx-0">
              Disinfectants stop working once they dry. ProteGo keeps surfaces protected for up to 30 days, touch after touch.
            </Item>
            <Item className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-9 sm:gap-4 lg:justify-start">
              <a href="#contact" className="btn rounded-full bg-turquoise px-7 py-4 font-semibold text-sherpa-deep hover:bg-white">
                Book a free assessment
              </a>
              <a
                href="#cleaning-gap"
                className="btn rounded-full border border-white/35 px-7 py-4 font-semibold text-white hover:border-white"
              >
                See the difference
              </a>
            </Item>

            {/* 30-day strip: the days fill in one after another */}
            <Item className="mx-auto mt-10 max-w-md sm:mt-12 lg:mx-0">
              <p className="sr-only">Protected every day, from day 1 to day 30.</p>
              <div aria-hidden className="flex gap-[3px]">
                {Array.from({ length: 30 }, (_, i) => (
                  <span
                    key={i}
                    className="day-tick h-2 flex-1 rounded-[2px] bg-white/15"
                    style={{ animationDelay: `${1.5 + i * 0.045}s` }}
                  />
                ))}
              </div>
              <div aria-hidden className="mt-2.5 flex justify-between text-xs font-semibold">
                <span className="text-white/60">Day 1</span>
                <span className="text-turquoise">Day 30 · still protected</span>
              </div>
            </Item>

            <ul className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-3 lg:mx-0 lg:justify-start">
              {PROOF.map(({ icon: Icon, label }) => (
                <Item as="li" key={label} effect="fade" className="flex items-center gap-2 text-sm font-semibold text-white/85">
                  <Icon aria-hidden className="size-5 shrink-0 text-turquoise" strokeWidth={1.6} />
                  {label}
                </Item>
              ))}
            </ul>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
