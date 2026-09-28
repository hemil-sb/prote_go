import type { Metadata } from "next";
import HeaderC from "@/components/c/HeaderC";
import LoaderC from "@/components/c/LoaderC";
import TouchLab from "@/components/c/TouchLab";
import GapStory from "@/components/c/GapStory";
import HowSteps from "@/components/c/HowSteps";
import ProductsC from "@/components/c/ProductsC";
import ServicesC from "@/components/c/ServicesC";
import Sectors from "@/components/c/Sectors";
import ClientsC from "@/components/c/ClientsC";
import FooterC from "@/components/c/FooterC";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Design C | ProteGo Hygiene",
  robots: { index: false },
};

/*
  Design C, "The touch test": a full-screen Three.js surface split in two, then a
  GSAP scroll story. Interaction first; the essentials follow.
*/
export default function DesignC() {
  return (
    <>
      <LoaderC />
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-orient px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <HeaderC />
      <main id="main">
        <TouchLab />
        <GapStory />
        <HowSteps />
        <ProductsC />
        <ServicesC />
        <Sectors />
        <ClientsC />
        <Faq />
        <Contact />
      </main>
      <FooterC />
    </>
  );
}
