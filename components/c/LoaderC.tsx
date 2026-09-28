"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "./gsap";
import { resetIntro, signal, when } from "./intro";

const MAX_WAIT = 3000; // never hold the page longer than this (ms) for the 3D scene
const GRACE = 500; // once the logo is complete, wait at most this much longer (ms) for the scene
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

/*
  Loading screen for design C. It is server-rendered, so it covers the page from
  the first paint, and the logo's entrance is pure CSS (.c-logo-* in globals.css),
  so it plays before React hydrates.

  Everything moves with transform and opacity only (CSS for the entrance, the Web
  Animations API for the exit), which the browser composites off the main thread:
  on a phone that is still busy loading the 3D scene, it stays smooth.

  Once the wordmark is in (and the touch test's surface is ready), the logo fades
  out completely, then a turquoise seam draws down the middle and the screen parts
  into two halves, opening onto the split surface. Reduced motion: a plain fade.
  Without JavaScript, a CSS fallback fades it out after a few seconds.
*/
export default function LoaderC() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    resetIntro();
    el.style.animation = "none"; // JavaScript is running: take over from the no-JS fallback
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";

    // The page always opens on the hero. A (hard) refresh would otherwise restore the
    // old scroll position under the loader, so turn off the browser's and ScrollTrigger's
    // scroll memory here, and go back to the top now and again as the screen parts.
    const restoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    ScrollTrigger.clearScrollMemory("manual");
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    toTop();

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $ = (sel: string) => el.querySelector<HTMLElement>(sel);
    const timers: number[] = [];
    const running: Animation[] = [];
    let logoDone = false;
    let sceneReady = false;
    let leaving = false;
    let disposed = false;

    const finish = () => {
      if (disposed) return;
      html.style.overflow = overflow;
      signal("intro");
      setGone(true);
    };
    const play = (node: HTMLElement | null, frames: Keyframe[], opts: KeyframeAnimationOptions) => {
      if (!node) return null;
      const a = node.animate(frames, { fill: "forwards", ...opts });
      running.push(a);
      return a;
    };

    function leave() {
      if (leaving || !logoDone || !sceneReady || disposed) return;
      leaving = true;
      toTop(); // a late scroll restore can land after hydration; the hero is what opens
      if (reduce) {
        play(el, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 })?.finished.then(finish, finish);
        return;
      }
      // 1. the logo goes, completely
      play(
        $("[data-loader-brand]"),
        [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(0.96)" },
        ],
        { duration: 280, easing: "ease-in" },
      );
      // 2. then the seam draws down the middle
      play(
        $("[data-loader-seam]"),
        [{ transform: "translateX(-50%) scaleY(0)" }, { transform: "translateX(-50%) scaleY(1)" }],
        { delay: 260, duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
      play($("[data-loader-seam-glow]"), [{ opacity: 1 }, { opacity: 0 }], { delay: 760, duration: 260 });
      // 3. then the halves part (the solid backdrop behind them drops away as they start)
      play($("[data-loader-back]"), [{ opacity: 1 }, { opacity: 0 }], { delay: 540, duration: 1 });
      play($("[data-loader-half='left']"), [{ transform: "translateX(0)" }, { transform: "translateX(-100%)" }], {
        delay: 540,
        duration: 800,
        easing: EASE_IN_OUT,
      });
      const last = play($("[data-loader-half='right']"), [{ transform: "translateX(0)" }, { transform: "translateX(100%)" }], {
        delay: 540,
        duration: 800,
        easing: EASE_IN_OUT,
      });
      last?.finished.then(finish, finish);
    }

    // leave as soon as the logo's glide has finished (it may already have, on a slow load)
    const logoReady = () => {
      if (logoDone || disposed) return;
      logoDone = true;
      timers.push(
        window.setTimeout(() => {
          sceneReady = true;
          leave();
        }, GRACE),
      );
      leave();
    };
    const slide = $(".c-logo-icon")
      ?.getAnimations()
      .find((a) => (a as CSSAnimation).animationName === "c-slide");
    if (slide && slide.playState !== "finished") slide.finished.then(logoReady, logoReady);
    else logoReady();

    timers.push(
      window.setTimeout(() => {
        sceneReady = true;
        logoReady();
      }, MAX_WAIT),
    );
    const off = when("scene", () => {
      sceneReady = true;
      leave();
    });

    return () => {
      disposed = true;
      off();
      timers.forEach(clearTimeout);
      running.forEach((a) => a.cancel());
      html.style.overflow = overflow;
      history.scrollRestoration = restoration;
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} role="status" aria-label="Loading ProteGo Hygiene" className="c-loader fixed inset-0 z-[90] overflow-hidden">
      {/* one solid backdrop, so no seam shows between the halves while the logo is up */}
      <div data-loader-back className="absolute inset-0 bg-sherpa-deep" />
      {/* each half shows its side of one shared, full-screen pattern */}
      <div data-loader-half="left" className="absolute inset-y-0 left-0 w-1/2 overflow-hidden will-change-transform">
        <div className="absolute inset-y-0 left-0 w-[200%]">
          <div className="plus-field h-full bg-sherpa-deep" data-tone="dark" data-fade="tl" />
        </div>
      </div>
      <div data-loader-half="right" className="absolute inset-y-0 right-0 w-1/2 overflow-hidden will-change-transform">
        <div className="absolute inset-y-0 right-0 w-[200%]">
          <div className="plus-field h-full bg-sherpa-deep" data-tone="dark" data-fade="tl" />
        </div>
      </div>
      <div data-loader-seam-glow aria-hidden className="absolute inset-y-0 left-1/2 w-0.5">
        <div
          data-loader-seam
          className="h-full w-full bg-turquoise shadow-[0_0_24px_4px_rgb(106_230_220/0.45)]"
          style={{ transform: "translateX(-50%) scaleY(0)" }}
        />
      </div>

      <div className="absolute inset-0 grid place-items-center px-6">
        <div data-loader-brand className="relative aspect-[856/307] w-[min(62vw,300px)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- must paint before hydration, no layout shift */}
          <img src="/brand/logo-horizontal-white.svg" alt="ProteGo Hygiene" width={856} height={307} className="c-logo-icon" />
          {/* eslint-disable-next-line @next/next/no-img-element -- the same lockup, clipped to the wordmark */}
          <img src="/brand/logo-horizontal-white.svg" alt="" aria-hidden width={856} height={307} className="c-logo-word" />
        </div>
      </div>
    </div>
  );
}
