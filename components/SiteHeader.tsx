"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll } from "motion/react";
import { Item, Stagger } from "@/components/Motion";

export const NAV = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#products", label: "Products" },
  { href: "#services", label: "Services" },
  { href: "#industries", label: "Industries" },
  { href: "#clients", label: "Clients" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-spring/90 backdrop-blur-md transition-shadow ${
        scrolled ? "shadow-[0_1px_0_var(--color-spring-deep)]" : ""
      }`}
    >
      <Stagger onMount gap={0.07} className="wrap flex h-20 items-center justify-between gap-6">
        {/* Brand rule: logo top-left, never centred — even on small screens */}
        <Item effect="drop" className="shrink-0">
          <Link href="/" aria-label="ProteGo Hygiene home" className="block">
            <Image
              src="/brand/logo-horizontal-dark.svg"
              alt="ProteGo Hygiene"
              width={856}
              height={306}
              loading="eager"
              className="h-[52px] w-auto"
            />
          </Link>
        </Item>

        <Item as="nav" effect="drop" aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-8 text-[0.9375rem] font-medium text-sherpa-deep">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-orient">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </Item>

        <Item effect="drop" className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full bg-orient px-5 py-3 text-sm font-semibold text-white btn hover:bg-sherpa whitespace-nowrap sm:inline-block"
          >
            Book a free assessment
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-spring-deep text-sherpa-deep xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </Item>
      </Stagger>

      {/* reading progress */}
      <motion.div aria-hidden style={{ scaleX: scrollYProgress }} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-orient" />

      <nav id="mobile-nav" aria-label="Main" hidden={!open} className="border-t border-spring-deep bg-spring xl:hidden">
        <ul className="wrap flex flex-col py-4 text-lg font-medium text-sherpa-deep">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="block py-3" onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
          <li className="pt-3">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="inline-block rounded-full bg-orient px-5 py-3 text-base font-semibold text-white"
            >
              Book a free assessment
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
