"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Split from "./Split";
import { gsap, MOTION, reveal, ScrollTrigger, useGsap } from "./gsap";

// The six industry groups and photos from design A's industry explorer, then Hospital to Home™
const INDUSTRIES = [
  {
    name: "Healthcare",
    covers: "Hospitals, clinics and diagnostic centres",
    img: "/images/clinician-scrubs.jpg",
    alt: "A smiling healthcare worker in turquoise scrubs",
    spots: "Bed rails, nurse stations, lift buttons",
  },
  {
    name: "Education",
    covers: "Schools, colleges and campuses",
    img: "/images/education-classroom.jpg",
    alt: "Students writing at their desks in a classroom",
    spots: "Desks, labs, libraries, canteens",
  },
  {
    name: "Hospitality and food",
    covers: "Hotels, restaurants, QSRs, cafés and cloud kitchens",
    img: "/images/cafe-table-cleaning.jpg",
    alt: "A café worker wiping down a table",
    spots: "Dining tables, menus, cash desks",
  },
  {
    name: "Workplaces and retail",
    covers: "Offices, tech parks, malls, multiplexes and gyms",
    img: "/images/office-worker.jpg",
    alt: "A smiling office worker at her desk",
    spots: "Turnstiles, workstations, handrails",
  },
  {
    name: "Travel and public spaces",
    covers: "Airports, railways and government buildings",
    img: "/images/travel-escalator.jpg",
    alt: "Travellers riding an escalator, hands on the handrail",
    spots: "Kiosks, security trays, grab rails",
  },
  {
    name: "Manufacturing",
    covers: "Pharma and food processing",
    img: "/images/scientist-microscope.jpg",
    alt: "A scientist working at a microscope",
    spots: "Gowning rooms, corridors, access control",
  },
  {
    name: "Hospital to Home™",
    covers: "The surfaces a recovering patient touches most, protected before they come home",
    img: "/images/caregiver-elderly.jpg",
    alt: "A caregiver supporting an elderly person as they walk",
    spots: "Bed rails, bathroom fittings, door handles",
    cta: "Talk to us about a home visit",
  },
];

const N = INDUSTRIES.length;
const STEP_VH = 0.6; // scroll distance per industry, as a share of the screen height

/*
  Where it works. The whole section fits one screen and pins: scrolling steps
  through the industries (snapping to each), crossfading to each photo in turn, and
  after the last one the page carries on. With reduced motion it doesn't pin;
  the names are buttons that switch the photo.
*/
export default function Sectors() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  useGsap(root, (mm, el) => {
    mm.add(MOTION, () => {
      reveal(el);
      el.dataset.pinned = "";
      const centres = INDUSTRIES.map((_, i) => (i + 0.5) / N);
      let last = 0;
      trigger.current = ScrollTrigger.create({
        trigger: el.querySelector("[data-where-pin]"),
        start: "top top",
        end: () => `+=${window.innerHeight * STEP_VH * N}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // settle on each industry; 0 and 1 let the visitor leave at either end
        snap: { snapTo: [0, ...centres, 1], duration: { min: 0.25, max: 0.6 }, delay: 0.05, ease: "power2.inOut" },
        onUpdate: (self) => {
          const i = Math.min(N - 1, Math.floor(self.progress * N));
          if (bar.current) gsap.set(bar.current, { scaleX: self.progress });
          if (i !== last) {
            last = i;
            setActive(i);
          }
        },
      });
      return () => {
        trigger.current = null;
        delete el.dataset.pinned;
      };
    });
  });

  // a name jumps to its stop in the pinned scroll (or just switches the photo)
  function go(i: number) {
    const st = trigger.current;
    if (!st) return setActive(i);
    window.scrollTo({ top: st.start + ((i + 0.5) / N) * (st.end - st.start), behavior: "smooth" });
  }

  const current = INDUSTRIES[active];

  return (
    <section
      id="where"
      ref={root}
      aria-labelledby="where-title"
      className="on-dark plus-field bg-sherpa text-white"
      data-tone="dark"
      data-fade="tl"
    >
      <div data-where-pin className="flex min-h-[100svh] flex-col pb-8 pt-20 [@media(max-height:700px)]:pb-4 lg:h-[100svh] lg:pb-10 lg:pt-28">
        <div className="wrap w-full">
          <p className="text-sm font-semibold text-turquoise">Where it works</p>
          <Split id="where-title" text="Every surface. Every day." className="mt-2 text-headline font-normal text-turquoise lg:mt-3" />
        </div>

        <div className="wrap mt-5 flex w-full min-h-0 flex-1 flex-col gap-5 lg:mt-10 lg:grid lg:grid-cols-12 lg:gap-10">
          {/* photo stage, with the industry's detail as its caption */}
          <div
            className="relative isolate min-h-[9rem] flex-1 overflow-hidden rounded-[1.5rem] bg-sherpa-deep shadow-[0_24px_60px_-30px_rgb(0_0_0/0.6)] sm:rounded-[2rem] lg:order-2 lg:col-span-6 lg:col-start-7 lg:h-full"
          >
            {/* As in design A: every photo stays mounted and stacked, so switching is a true
                crossfade. The new photo fades in on top while it settles from a slight zoom,
                and the old one only drops out once it is covered. */}
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
                  <Image src={ind.img} alt={on ? ind.alt : ""} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
                </div>
              );
            })}
            <div aria-hidden className="absolute inset-x-0 bottom-0 z-20 h-2/3 bg-gradient-to-t from-sherpa-deep/90 via-sherpa-deep/50 to-transparent" />
            <div key={current.name} className="ind-fade absolute inset-x-0 bottom-0 z-30 p-4 sm:p-6 lg:p-8" aria-live="polite">
              <p className="text-sm font-semibold text-turquoise">{current.name}</p>
              <p className="mt-1 max-w-[30rem] text-sm text-white sm:text-lg">{current.covers}</p>
              <p className="mt-1 hidden text-sm text-white/70 sm:block">High-touch: {current.spots}</p>
              {current.cta && (
                <a
                  href="#contact"
                  className="btn mt-3 inline-block rounded-full bg-turquoise px-4 py-2 text-sm font-semibold text-sherpa-deep hover:bg-white sm:mt-4 sm:px-5 sm:py-2.5"
                >
                  {current.cta}
                </a>
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col lg:order-1 lg:col-span-6 lg:justify-center">
            <ol>
              {INDUSTRIES.map((ind, i) => (
                <li key={ind.name} className="border-b border-white/10 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={i === active ? "true" : undefined}
                    className={`flex w-full cursor-pointer items-baseline gap-3 py-1.5 text-left [@media(max-height:700px)]:py-1 transition-opacity duration-500 hover:opacity-100 sm:gap-4 lg:py-2.5 ${
                      i === active ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <span className="w-6 shrink-0 text-xs font-semibold tabular-nums text-turquoise sm:text-sm">0{i + 1}</span>
                    <span className="text-[clamp(1.125rem,0.8rem+1.5vw,2.25rem)] font-light leading-tight tracking-[-0.02em]">{ind.name}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div aria-hidden className="mt-4 hidden h-px bg-white/15 lg:mt-6 [[data-pinned]_&]:block">
              <span ref={bar} className="block h-full origin-left bg-turquoise" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
