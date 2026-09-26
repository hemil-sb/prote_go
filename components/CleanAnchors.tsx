"use client";

import { useEffect } from "react";

/*
  In-page links (href="#section") keep working as normal links (keyboard,
  no-JS fallback), but clicking one scrolls to the section without adding
  "#section" to the address bar. A URL that arrives with a hash is scrolled
  to and then cleaned.
*/
export default function CleanAnchors() {
  useEffect(() => {
    const clean = () => history.replaceState(history.state, "", location.pathname + location.search);

    function go(id: string, smooth: boolean) {
      const target = document.getElementById(id);
      if (!target) return false;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      // scroll-padding-top on <html> keeps the section clear of the sticky header
      target.scrollIntoView({ behavior: smooth && !reduce ? "smooth" : "auto", block: "start" });
      // move focus for keyboard and screen-reader users, without a second jump
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      return true;
    }

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest?.("a[href^='#']");
      if (!link) return;
      const id = decodeURIComponent(link.getAttribute("href")!.slice(1));
      if (!id) return;
      if (go(id, true)) e.preventDefault();
    }

    function fromHash() {
      if (!location.hash) return;
      go(decodeURIComponent(location.hash.slice(1)), false);
      clean();
    }

    fromHash();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", fromHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);

  return null;
}
