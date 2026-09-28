"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { gsap } from "./gsap";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#products", label: "Products" },
  { href: "#services", label: "Services" },
  { href: "#where", label: "Industries" },
  { href: "#plans", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/*
  A solid bar, so the split surface of the touch test starts cleanly below it.
  Below xl the links move into a full-screen menu behind a menu button.
*/
export default function HeaderC() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const firstRun = useRef(true);

  // open and close the menu
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = el.querySelectorAll("[data-menu-item]");
    const html = document.documentElement;
    if (firstRun.current) {
      firstRun.current = false;
      gsap.set(el, { autoAlpha: 0 });
      return;
    }
    gsap.killTweensOf([el, ...items]);
    if (open) {
      html.style.overflow = "hidden";
      gsap.set(el, { autoAlpha: 1 });
      if (reduce) return;
      gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power3.inOut" });
      gsap.fromTo(items, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.05, delay: 0.2 });
    } else {
      html.style.overflow = "";
      if (reduce) {
        gsap.set(el, { autoAlpha: 0 });
        return;
      }
      gsap.to(el, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.45,
        ease: "power3.inOut",
        onComplete: () => void gsap.set(el, { autoAlpha: 0 }),
      });
    }
  }, [open]);

  // Escape closes it, and so does widening the window to desktop
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const wide = matchMedia("(min-width: 1280px)");
    const onWide = () => {
      if (wide.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  // never leave the page scroll-locked when navigating away
  useEffect(
    () => () => {
      document.documentElement.style.overflow = "";
    },
    [],
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="relative z-10 bg-spring/95 shadow-[0_1px_0_var(--color-spring-deep)] backdrop-blur-md">
        <div className="wrap flex h-16 items-center justify-between gap-6 lg:h-20">
          {/* Brand rule: logo top-left, never centred */}
          <Link href="/c" aria-label="ProteGo Hygiene home" className="block shrink-0" onClick={() => setOpen(false)}>
            <Image
              src="/brand/logo-horizontal-dark.svg"
              alt="ProteGo Hygiene"
              width={856}
              height={306}
              loading="eager"
              className="h-[50px] w-auto"
            />
          </Link>
          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-8 text-[0.9375rem] font-medium text-sherpa-deep">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="transition-colors hover:text-orient">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="btn hidden shrink-0 rounded-full bg-sherpa px-5 py-3 text-sm font-semibold text-white hover:bg-sherpa-deep sm:inline-block"
            >
              Book a free assessment
            </a>
            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="c-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-sherpa/20 text-sherpa-deep transition-colors hover:border-sherpa xl:hidden"
            >
              {open ? <X className="size-5" strokeWidth={2} /> : <Menu className="size-5" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      {/* full-screen menu below xl */}
      <div
        ref={panel}
        id="c-menu"
        inert={!open}
        className="on-dark invisible fixed inset-0 overflow-y-auto bg-sherpa-deep pt-16 text-white lg:pt-20 xl:hidden"
      >
        <nav aria-label="Menu" className="wrap flex min-h-full flex-col justify-between gap-10 py-8 sm:py-12">
          <ul>
            {NAV.map((n, i) => (
              <li key={n.href} data-menu-item className="border-b border-white/10">
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-3.5 transition-colors hover:text-turquoise sm:py-4"
                >
                  <span className="w-6 text-sm font-semibold tabular-nums text-turquoise">0{i + 1}</span>
                  <span className="text-[clamp(1.75rem,1.3rem+2vw,2.75rem)] font-light leading-tight tracking-[-0.02em]">{n.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div data-menu-item>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn inline-block rounded-full bg-turquoise px-6 py-3.5 font-semibold text-sherpa-deep hover:bg-white"
            >
              Book a free assessment
            </a>
            <p className="mt-5 text-sm text-white/65">
              <a href="mailto:sales@protegohygiene.com" className="hover:text-white">
                sales@protegohygiene.com
              </a>
              <span aria-hidden className="mx-2 text-white/30">
                ·
              </span>
              <a href="tel:+919967053755" className="hover:text-white">
                +91 99670 53755
              </a>
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
