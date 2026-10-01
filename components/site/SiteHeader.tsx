"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import { CONTACT } from "@/content/contact";
import { NAV } from "@/content/site";
import { useCart } from "@/components/cart/CartProvider";

/*
  Every page opens on a dark hero (the 3D story on the home page, a PageHero elsewhere),
  marked with data-hero. The header is transparent with the white logo at the very top,
  becomes a dark frosted bar as soon as a PageHero starts scrolling under it (so hero text never
  collides with the nav), and a light bar with the dark logo once the hero has scrolled away.
  Over the full-screen 3D story (data-hero="immersive") it stays clear, with only a soft scrim
  for legibility, so the scene isn't cut by a bar.
  Pages without a dark hero (cart, checkout) get the light bar straight away. The menu is a
  full-screen sheet.
*/
const MENU = [...NAV.slice(0, 3), { href: "/hospital-to-home", label: "Hospital to Home™" }, ...NAV.slice(3)];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const wasOpen = useRef(false);
  const { count, ready } = useCart();

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector("[data-hero]");
      setLight(hero ? hero.getBoundingClientRect().bottom <= 80 : true);
      setScrolled(window.scrollY > 8);
      setImmersive(hero?.getAttribute("data-hero") === "immersive");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

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

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const cartLabel = ready && count ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
          light
            ? "bg-spring/90 shadow-[0_1px_0_var(--color-spring-deep)] backdrop-blur-md"
            : !scrolled
              ? "bg-transparent"
              : immersive
                ? "bg-gradient-to-b from-black/45 to-transparent"
                : "bg-sherpa-deep/85 shadow-[0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md"
        }`}
      >
        <div className="wrap flex h-20 items-center justify-between gap-4">
          <Link href="/" aria-label="ProteGo Hygiene home" className="shrink-0">
            <Image
              src={light ? "/brand/logo-horizontal-dark.svg" : "/brand/logo-horizontal-white.svg"}
              alt="ProteGo Hygiene"
              width={856}
              height={306}
              loading="eager"
              className="h-11 w-auto"
            />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((l) => {
                const on = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={on ? "page" : undefined}
                      className={`relative rounded-full px-3 py-2 text-sm font-semibold transition-colors xl:px-4 ${
                        light
                          ? on
                            ? "text-sherpa-deep"
                            : "text-sherpa-deep/65 hover:text-sherpa-deep"
                          : on
                            ? "text-turquoise"
                            : "text-white/75 hover:text-white"
                      }`}
                    >
                      {l.label}
                      {on && (
                        <span
                          aria-hidden
                          className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full xl:inset-x-4 ${light ? "bg-orient" : "bg-turquoise"}`}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/contact"
              className={`btn hidden whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold sm:inline-block lg:hidden xl:inline-block ${
                light ? "bg-orient text-white hover:bg-sherpa" : "bg-turquoise text-sherpa-deep hover:bg-white"
              }`}
            >
              Book a free assessment
            </Link>
            <Link
              href="/cart"
              aria-label={cartLabel}
              className={`relative grid size-11 shrink-0 place-items-center rounded-full ring-1 transition-colors ${
                light ? "text-sherpa-deep ring-sherpa-deep/20 hover:bg-sherpa-deep/5" : "text-white ring-white/30 hover:bg-white/10"
              }`}
            >
              <ShoppingBag aria-hidden className="size-[18px]" strokeWidth={1.8} />
              {ready && count > 0 && (
                <span
                  aria-hidden
                  className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-turquoise px-1 text-[11px] font-bold leading-5 text-sherpa-deep"
                >
                  {count}
                </span>
              )}
            </Link>
            <button
              ref={button}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu-sheet"
              className={`flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 transition-colors lg:hidden ${
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
        id="menu-sheet"
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

          <div className="wrap grid gap-12 pb-28 pt-6 lg:grid-cols-12 lg:pt-14">
            <nav aria-label="Menu" className="lg:col-span-7">
              <ul>
                {[{ href: "/", label: "Home" }, ...MENU].map((l, i) => (
                  <li key={l.href} className="ind-chip border-b border-white/10" style={{ animationDelay: `${60 + i * 40}ms` }}>
                    <Link
                      ref={i === 0 ? firstLink : undefined}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={pathname === l.href ? "page" : undefined}
                      className={`group flex items-center gap-5 py-2.5 text-[clamp(1.75rem,1.3rem+2.2vw,3.25rem)] font-light leading-tight tracking-[-0.03em] transition-colors hover:text-turquoise ${
                        pathname === l.href ? "text-turquoise" : ""
                      }`}
                    >
                      {l.label}
                      <ArrowUpRight aria-hidden className="ml-auto size-6 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="ind-chip lg:col-span-4 lg:col-start-9 lg:pt-4" style={{ animationDelay: "320ms" }}>
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
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn mt-8 inline-block rounded-full bg-turquoise px-7 py-4 font-semibold text-sherpa-deep hover:bg-white"
              >
                Book a free assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
