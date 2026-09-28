import type { Metadata } from "next";
import HeaderB from "@/components/design-b/HeaderB";
import ShieldStory from "@/components/design-b/ShieldStory";
import ProductsB from "@/components/design-b/sections/ProductsB";
import ServiceB from "@/components/design-b/sections/ServiceB";
import IndustriesB from "@/components/design-b/sections/IndustriesB";
import ClientsB from "@/components/design-b/sections/ClientsB";
import HospitalToHomeB from "@/components/design-b/sections/HospitalToHomeB";
import AboutB from "@/components/design-b/sections/AboutB";
import FaqB from "@/components/design-b/sections/FaqB";
import ContactB from "@/components/design-b/sections/ContactB";
import FooterB from "@/components/design-b/sections/FooterB";

export const metadata: Metadata = {
  title: "Design B | ProteGo Hygiene",
  robots: { index: false },
};

/*
  Design B, "The Invisible Shield": a scroll-driven Three.js + GSAP story, then the
  essentials in a card-based layout. Spec: docs/specs/2026-09-28-design-b-invisible-shield.md
*/
export default function DesignB() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-turquoise px-4 py-2 font-semibold text-sherpa-deep focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <HeaderB />
      <main id="main" className="bg-spring">
        <ShieldStory />
        <ProductsB />
        <ServiceB />
        <HospitalToHomeB />
        <IndustriesB />
        <ClientsB />
        <AboutB />
        <FaqB />
        <ContactB />
      </main>
      <FooterB />
    </>
  );
}
