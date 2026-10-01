"use client";

import Image from "next/image";
import ExploreLink from "@/components/site/ExploreLink";
import { useEffect, useRef, useState } from "react";
import { Building2, Factory, GraduationCap, Hospital, Plane, ShieldCheck, UtensilsCrossed, type LucideIcon } from "lucide-react";
import Placeholder from "@/components/Placeholder";

/*
  Interactive industry explorer.
  Hotspots come from each vertical's "Ideal for" lists (Vertical Master deck and sector briefs),
  limited to non-food-contact / non-product-contact surfaces.
  Sign-off lines are the brand's own, from the Vertical Master deck.
*/
const INDUSTRIES: {
  icon: LucideIcon;
  name: string;
  covers: string;
  img?: string;
  alt?: string;
  placeholder?: string;
  hotspots: string[];
  line: string;
  cta: string;
  href: string;
}[] = [
  {
    icon: Hospital,
    name: "Healthcare",
    href: "/industries/healthcare",
    covers: "Hospitals, clinics and recovery at home",
    img: "/images/clinician-scrubs.jpg",
    alt: "A smiling healthcare worker in turquoise scrubs",
    hotspots: ["Bed rails", "Nurse stations", "OPD waiting areas", "Lift buttons", "Door handles", "Medical equipment"],
    line: "Protective care begins with protecting every surface.",
    cta: "hospital or clinic",
  },
  {
    icon: GraduationCap,
    name: "Education",
    href: "/industries/education",
    covers: "Schools, colleges and campuses",
    img: "/images/education-classroom.jpg",
    alt: "Students writing at their desks in a classroom",
    hotspots: ["Desks", "Science labs", "Libraries", "Washrooms", "Canteens", "School buses"],
    line: "A clean school today builds a healthier generation tomorrow.",
    cta: "school",
  },
  {
    icon: UtensilsCrossed,
    name: "Hospitality and food",
    href: "/industries/hotels-and-resorts",
    covers: "Hotels, restaurants, QSRs, cafés and cloud kitchens",
    img: "/images/cafe-table-cleaning.jpg",
    alt: "A café worker wiping down a table",
    hotspots: ["Guest rooms", "Lobbies", "Dining tables", "Menus", "Cash desks", "Delivery stations"],
    line: "In hospitality, hygiene is part of the experience.",
    cta: "hotel or restaurant",
  },
  {
    icon: Building2,
    name: "Workplaces and retail",
    href: "/industries/offices",
    covers: "Offices, tech parks, malls, multiplexes and gyms",
    img: "/images/office-worker.jpg",
    alt: "A smiling office worker at her desk",
    hotspots: ["Lift buttons", "Turnstiles", "Workstations", "Meeting rooms", "Escalator handrails", "Gym equipment"],
    line: "Protect better. Operate smarter.",
    cta: "building",
  },
  {
    icon: Plane,
    name: "Travel and public spaces",
    href: "/industries/airports",
    covers: "Airports, railways and government buildings",
    img: "/images/travel-escalator.jpg",
    alt: "Travellers riding an escalator, hands on the handrail, beneath a bilingual toilets sign",
    hotspots: ["Check-in kiosks", "Security trays", "Gate seating", "Grab rails", "Coach washrooms", "Service counters"],
    line: "Travel is evolving. Hygiene should too.",
    cta: "terminal or station",
  },
  {
    icon: Factory,
    name: "Manufacturing",
    href: "/industries/pharmaceutical",
    covers: "Pharma and food processing",
    img: "/images/scientist-microscope.jpg",
    alt: "A scientist working at a microscope",
    hotspots: ["Change and gowning rooms", "Corridors", "Access control", "Staff cafeterias", "Packaging and dispatch", "Washrooms"],
    line: "Take hygiene from reactive to reliable.",
    cta: "facility",
  },
];

const CYCLE_MS = 3000;

export default function IndustryExplorer() {
  const [active, setActive] = useState(0);
  const [round, setRound] = useState(0); // restarts the timer when the same tab is clicked again
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // On phones, slide the pill row so the active industry stays visible (horizontal only, never the page)
  useEffect(() => {
    const list = listRef.current;
    const tab = list?.children[active] as HTMLElement | undefined;
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: tab.offsetLeft - list.offsetLeft - 24, behavior: "smooth" });
  }, [active]);

  const current = INDUSTRIES[active];
  const paused = !inView;

  function choose(i: number) {
    setActive(i);
    setRound((r) => r + 1);
  }

  function next() {
    setActive((a) => (a + 1) % INDUSTRIES.length);
  }

  return (
    <div ref={ref} className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Industry list: pills on phones, a tall list on desktop */}
      <div className="min-w-0 lg:col-span-5">
        <div
          ref={listRef}
          role="tablist"
          aria-label="Industries"
          className="-mx-[var(--gutter)] flex snap-x gap-2 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {INDUSTRIES.map((ind, i) => {
            const on = i === active;
            const Icon = ind.icon;
            return (
              <button
                key={ind.name}
                role="tab"
                id={`ind-tab-${i}`}
                aria-selected={on}
                aria-controls="ind-panel"
                onClick={() => choose(i)}
                className={`group relative flex shrink-0 snap-start items-center gap-3 rounded-full px-4 py-2.5 text-left transition-colors lg:rounded-none lg:border-b lg:border-spring-deep lg:px-0 lg:py-5 ${
                  on
                    ? "bg-sherpa-deep text-white lg:bg-transparent lg:text-sherpa-deep"
                    : "bg-spring text-sherpa-deep/70 hover:text-sherpa-deep lg:bg-transparent"
                }`}
              >
                <Icon
                  aria-hidden
                  className={`size-5 shrink-0 transition-colors lg:size-7 ${on ? "text-turquoise lg:text-orient" : "text-current"}`}
                  strokeWidth={1.5}
                />
                <span className="min-w-0">
                  <span
                    className={`block whitespace-nowrap text-sm font-semibold lg:text-title lg:font-normal ${on ? "" : "lg:text-ink/45"}`}
                  >
                    {ind.name}
                  </span>
                  <span className={`hidden text-sm text-ink/55 lg:block ${on ? "lg:block" : "lg:hidden"}`}>{ind.covers}</span>
                </span>

                {/* countdown to the next industry */}
                {on && (
                  <span
                    key={`p-${active}-${round}`}
                    aria-hidden
                    className="ind-progress absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-turquoise lg:inset-x-0 lg:-bottom-px lg:h-[3px] lg:rounded-none lg:bg-orient"
                    style={{ animationDuration: `${CYCLE_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                    onAnimationEnd={next}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage */}
      <div id="ind-panel" role="tabpanel" aria-labelledby={`ind-tab-${active}`} className="min-w-0 lg:col-span-7">
        <div className="relative">
          {/* All photos stay mounted and stacked, so switching is a true crossfade:
              the new photo fades in on top, and the old one only drops out once covered. */}
          <div className="relative isolate aspect-[4/3] overflow-hidden rounded-[2rem] bg-sherpa-deep lg:aspect-[16/11]">
            {INDUSTRIES.map((ind, i) => {
              const on = i === active;
              return (
                <div
                  key={ind.name}
                  aria-hidden={!on}
                  className={`absolute inset-0 ${
                    on
                      ? "z-10 scale-100 opacity-100 [transition:opacity_800ms_ease-out,scale_3000ms_cubic-bezier(0.22,1,0.36,1)]"
                      : "z-0 scale-[1.05] opacity-0 [transition:opacity_0ms_800ms,scale_0ms_800ms]"
                  }`}
                >
                  {ind.img ? (
                    <Image
                      src={ind.img}
                      alt={on ? (ind.alt ?? "") : ""}
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-turquoise-tint">
                      <Placeholder label={ind.placeholder ?? "Photo"} hint="1200 × 900 px" className="absolute inset-3 sm:pb-36" />
                    </div>
                  )}
                </div>
              );
            })}
            {current.img && (
              <div
                aria-hidden
                className="absolute inset-0 z-20 hidden bg-gradient-to-t from-sherpa-deep/85 via-sherpa-deep/20 to-transparent sm:block"
              />
            )}
          </div>

          {/* hotspots: below the image on phones, over it from tablet up */}
          <div className="pt-5 sm:absolute sm:inset-x-0 sm:bottom-0 sm:p-7">
            <p className={`flex items-center gap-2 text-sm font-semibold text-sherpa ${current.img ? "sm:text-turquoise" : ""}`}>
              <ShieldCheck aria-hidden className="size-4" strokeWidth={2} />
              High-touch surfaces we protect
            </p>
            <ul key={active} className="mt-3 flex flex-wrap gap-2">
              {current.hotspots.map((h, i) => (
                <li
                  key={h}
                  className={`ind-chip flex items-center gap-2 rounded-full bg-turquoise-tint px-3 py-1.5 text-xs font-semibold text-sherpa-deep sm:text-sm ${
                    current.img ? "sm:bg-white/95" : "sm:bg-sherpa-deep sm:text-white"
                  }`}
                  style={{ animationDelay: `${150 + i * 70}ms` }}
                >
                  <span aria-hidden className="size-1.5 rounded-full bg-turquoise-deep" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p key={active} className="ind-fade max-w-[26rem] text-title font-normal text-sherpa-deep">
            {current.line}
          </p>
          <ExploreLink href={current.href} tone="outline" className="shrink-0 self-start sm:self-auto">
            Protection for your {current.cta}
          </ExploreLink>
        </div>
      </div>
    </div>
  );
}
