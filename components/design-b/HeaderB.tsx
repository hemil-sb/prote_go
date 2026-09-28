"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { CONTACT } from "@/content/contact";

/*
  Design B header. Transparent over the dark story (white logo); once the story has
  scrolled away it turns into a light bar with the dark logo, so it stays legible on
  the light sections. The menu is a full-screen sheet.
*/
const LINKS = [
  { href: "#products", label: "Product" },
  { href: "#service", label: "Service" },
  { href: "#industries", label: "Industries" },
  { href: "#clients", label: "Clients" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function HeaderB() {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const wasOpen = useRef(false);

  // light bar once the story section's bottom has passed under the header
  useEffect(() => {
    const onScroll = () => {
      const story = document.getElementById("story");
      setLight(story ? story.getBoundingClientRect().bottom <= 80 : window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      firstLink.current?.focus();
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      if (wasOpen.current) button.current?.focus();
    }
    wasOpen.current = open;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
          light ? "bg-spring/90 shadow-[0_1px_0_var(--color-spring-deep)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="wrap flex h-20 items-center justify-between gap-4">
          <Link href="/b" aria-label="ProteGo Hygiene home" className="shrink-0">
            <Image
              src={light ? "/brand/logo-horizontal-dark.svg" : "/brand/logo-horizontal-white.svg"}
              alt="ProteGo Hygiene"
              width={856}
              height={306}
              loading="eager"
              className="h-11 w-auto"
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#contact"
              className={`btn hidden whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold sm:inline-block ${
                light ? "bg-orient text-white hover:bg-sherpa" : "bg-turquoise text-sherpa-deep hover:bg-white"
              }`}
            >
              Book a free assessment
            </a>
            <button
              ref={button}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu-b"
              className={`flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 transition-colors ${
                light ? "text-sherpa-deep ring-sherpa-deep/20 hover:bg-sherpa-deep/5" : "text-white ring-white/30 hover:bg-white/10"
              }`}
            >
              Menu
              <Menu aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-b"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-[80] overflow-y-auto bg-sherpa-deep text-white"
      >
        <div className="plus-field min-h-full" data-tone="dark" data-fade="br">
          <div className="wrap flex h-20 items-center justify-between">
            <Image src="/brand/logo-horizontal-white.svg" alt="" width={856} height={307} aria-hidden className="h-11 w-auto" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 ring-white/30 transition-colors hover:bg-white/10"
            >
              Close
              <X aria-hidden className="size-4" />
            </button>
          </div>

          <div className="wrap grid gap-12 pb-28 pt-8 lg:grid-cols-12 lg:pt-14">
            <nav aria-label="Main" className="lg:col-span-7">
              <ul>
                {LINKS.map((l, i) => (
                  <li key={l.href} className="ind-chip border-b border-white/10" style={{ animationDelay: `${60 + i * 45}ms` }}>
                    <a
                      ref={i === 0 ? firstLink : undefined}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-5 py-3 text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] font-light leading-tight tracking-[-0.03em] transition-colors hover:text-turquoise"
                    >
                      {l.label}
                      <ArrowUpRight aria-hidden className="ml-auto size-6 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="ind-chip lg:col-span-4 lg:col-start-9 lg:pt-4" style={{ animationDelay: "300ms" }}>
              <p className="text-sm font-semibold text-turquoise">Get in touch</p>
              <p className="mt-4 text-title font-normal">So you can focus on what matters.</p>
              <ul className="mt-6 space-y-2 text-white/80">
                <li>
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-turquoise">
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${CONTACT.phoneHref}`} className="hover:text-turquoise">
                    {CONTACT.phoneDisplay}
                  </a>
                </li>
                <li className="max-w-[20rem] text-sm text-white/60">{CONTACT.address}</li>
              </ul>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="btn mt-8 inline-block rounded-full bg-turquoise px-7 py-4 font-semibold text-sherpa-deep hover:bg-white"
              >
                Book a free assessment
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
