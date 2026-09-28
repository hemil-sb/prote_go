"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // phones resize the viewport as the address bar hides; don't re-measure pins for that
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const MOTION = "(prefers-reduced-motion: no-preference)";
export const REDUCE = "(prefers-reduced-motion: reduce)";
export const EASE = "power3.out";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Runs GSAP setup scoped to an element, inside a matchMedia so animations can
 * branch on reduced motion and screen size. Everything is reverted on unmount.
 */
export function useGsap(scope: RefObject<HTMLElement | null>, setup: (mm: gsap.MatchMedia, el: HTMLElement) => void) {
  useIsoLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);
    setup(mm, el);
    return () => mm.revert();
    // setup is written inline by each section and only ever runs once
  }, []);
}

/**
 * Entrance animations for everything marked up inside `el`:
 *   [data-split]  headings built with <Split>: words rise out of a mask
 *   [data-reveal] fades up; the attribute value is an optional delay in seconds
 *   [data-stagger] its children fade up one after another
 */
export function reveal(el: HTMLElement) {
  for (const heading of gsap.utils.toArray<HTMLElement>("[data-split]", el)) {
    gsap.from(heading.querySelectorAll("[data-word]"), {
      yPercent: 110,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.06,
      scrollTrigger: { trigger: heading, start: "top 88%", once: true },
    });
  }
  for (const item of gsap.utils.toArray<HTMLElement>("[data-reveal]", el)) {
    gsap.from(item, {
      autoAlpha: 0,
      y: 32,
      duration: 1,
      ease: EASE,
      delay: Number(item.dataset.reveal) || 0,
      scrollTrigger: { trigger: item, start: "top 90%", once: true },
    });
  }
  for (const group of gsap.utils.toArray<HTMLElement>("[data-stagger]", el)) {
    gsap.from(group.children, {
      autoAlpha: 0,
      y: 28,
      duration: 0.9,
      ease: EASE,
      stagger: 0.09,
      scrollTrigger: { trigger: group, start: "top 88%", once: true },
    });
  }
}

export { gsap, ScrollTrigger };
