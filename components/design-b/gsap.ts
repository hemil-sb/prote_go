"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Design B's GSAP setup (design C keeps its own; the two never share state)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // phones resize the viewport as the address bar hides; don't re-measure the pin for that
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };
