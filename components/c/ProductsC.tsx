"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import Split from "./Split";
import { gsap, MOTION, reveal, useGsap } from "./gsap";

const PACKS = [
  {
    size: "100 ml",
    img: "/products/protego-100ml.jpg",
    title: "Personal",
    line: "A personal bottle for the small things you touch every day.",
    facts: [{ label: "Use", value: "Personal" }],
  },
  {
    size: "500 ml",
    img: "/products/protego-500ml.jpg",
    title: "DIY Protection Kit",
    line: "Apply it yourself in a shop, café, clinic or small office.",
    facts: [
      { label: "Covers", value: "About 750 sq ft" },
      { label: "MRP", value: "₹1,049" },
    ],
  },
  {
    size: "20 L",
    img: "/products/protego-20l.jpg",
    title: "Facilities and partners",
    line: "Bulk supply for teams that apply at scale. Also available in 5 L.",
    facts: [{ label: "Covers", value: "About 30,000 sq ft" }],
  },
];

const FACTS = ["Ready to use, no dilution", "Up to 30 days per application", "About 98% water", "Non-leaching and non-flammable", "Dry in about an hour"];

const AUTO_MS = 3800;

/*
  Products. The three real packshots share one stage and crossfade as the size
  changes. While the section is on screen the sizes advance on their own, until
  the visitor picks one.
*/
export default function ProductsC() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicator = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const first = useRef(true);

  useGsap(root, (mm, el) => mm.add(MOTION, () => reveal(el)));

  // move the sliding pill under the chosen size
  useEffect(() => {
    const place = (animate: boolean) => {
      const tab = tabs.current[active];
      if (!tab || !indicator.current) return;
      gsap.to(indicator.current, {
        x: tab.offsetLeft,
        width: tab.offsetWidth,
        duration: animate ? 0.45 : 0,
        ease: "power3.out",
      });
    };
    place(!first.current);
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  // crossfade the packshots and bring in the details
  useEffect(() => {
    const imgs = stage.current?.querySelectorAll<HTMLElement>("[data-pack]");
    if (!imgs) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (first.current || reduce) {
      imgs.forEach((img, i) => gsap.set(img, { autoAlpha: i === active ? 1 : 0, scale: 1 }));
      first.current = false;
      return;
    }
    imgs.forEach((img, i) => {
      if (i === active) {
        gsap.fromTo(img, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power3.out", overwrite: true });
      } else {
        gsap.to(img, { autoAlpha: 0, scale: 0.96, duration: 0.45, ease: "power2.in", overwrite: true });
      }
    });
    const bits = panel.current?.querySelectorAll("[data-pack-bit]");
    if (bits) gsap.fromTo(bits, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.06 });
  }, [active]);

  // advance on their own while visible, until the visitor takes over
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !inView || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % PACKS.length), AUTO_MS);
    return () => clearTimeout(t);
  }, [auto, inView, active]);

  function choose(i: number) {
    setAuto(false);
    setActive(i);
  }
  function onKey(e: KeyboardEvent) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + PACKS.length) % PACKS.length;
    choose(next);
    tabs.current[next]?.focus();
  }

  const pack = PACKS[active];

  return (
    <section id="products" ref={root} aria-labelledby="products-title" className="bg-white">
      <div className="wrap py-16 sm:py-24 lg:py-28">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-orient">Products</p>
            <Split id="products-title" text="ProteGo Surface Protectant." className="mt-3 text-headline font-normal text-sherpa-deep" />
          </div>
          <p data-reveal="0.15" className="mt-5 max-w-[28rem] text-lede text-ink/70 lg:col-span-5 lg:mt-0">
            Ready to use. No dilution. Up to 30 days per application.
          </p>
        </div>

        <div data-reveal className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-12 lg:gap-10">
          <div
            ref={stage}
            className="relative aspect-[612/510] w-full max-w-[36rem] overflow-hidden rounded-[2rem] bg-panel lg:col-span-6"
          >
            {PACKS.map((p, i) => (
              <div key={p.size} data-pack className="absolute inset-0" style={{ opacity: i === 1 ? 1 : 0 }}>
                <Image
                  src={p.img}
                  alt={`ProteGo Surface Protectant, ${p.size}`}
                  fill
                  sizes="(min-width: 1024px) 55vw, 90vw"
                  className="object-cover"
                />
              </div>
            ))}
            <span className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1.5 text-xs font-semibold text-sherpa-deep backdrop-blur sm:left-6 sm:top-6">
              {pack.size}
            </span>
          </div>

          <div className="flex flex-col lg:col-span-6 lg:py-4 xl:col-span-5 xl:col-start-8">
            <div
              role="tablist"
              aria-label="Pack size"
              onKeyDown={onKey}
              className="relative inline-flex w-fit rounded-full bg-panel p-1.5"
            >
              <span ref={indicator} aria-hidden className="absolute inset-y-1.5 left-0 rounded-full bg-sherpa shadow-sm" />
              {PACKS.map((p, i) => (
                <button
                  key={p.size}
                  ref={(b) => void (tabs.current[i] = b)}
                  role="tab"
                  id={`pack-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls="pack-panel"
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => choose(i)}
                  className={`relative cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 sm:px-6 ${
                    i === active ? "text-white" : "text-sherpa-deep hover:text-orient"
                  }`}
                >
                  {p.size}
                </button>
              ))}
            </div>

            <div ref={panel} id="pack-panel" role="tabpanel" aria-labelledby={`pack-tab-${active}`} className="mt-8">
              <p data-pack-bit className="text-title font-semibold text-sherpa-deep">
                {pack.title}
              </p>
              <p data-pack-bit className="mt-2 max-w-[26rem] text-ink/70">
                {pack.line}
              </p>
              <dl data-pack-bit className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                {pack.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs font-semibold text-ink/55">{f.label}</dt>
                    <dd className="mt-1 text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-light tracking-[-0.02em] text-sherpa-deep">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <ul className="mt-8 grid gap-2.5 border-t border-spring-deep pt-6 text-sm text-ink/75 sm:grid-cols-2">
              {FACTS.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-orient" strokeWidth={2.4} />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ink/55">
              For hard, non-food-contact, high-touch surfaces. ProteGo complements routine cleaning; it does not replace it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="btn rounded-full bg-orient px-6 py-3.5 font-semibold text-white hover:bg-sherpa">
                Order the DIY kit
              </a>
              <a
                href="#contact"
                className="btn rounded-full border border-sherpa-deep/25 px-6 py-3.5 font-semibold text-sherpa-deep hover:border-sherpa-deep"
              >
                Bulk and trade enquiries
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
