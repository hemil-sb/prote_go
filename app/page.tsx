import HeaderB from "@/components/design-b/HeaderB";
import ShieldStory from "@/components/design-b/ShieldStory";
import HowItWorks from "@/components/sections/HowItWorks";
import Products from "@/components/sections/Products";
import ServiceB from "@/components/design-b/sections/ServiceB";
import HospitalToHomeB from "@/components/design-b/sections/HospitalToHomeB";
import IndustriesB from "@/components/design-b/sections/IndustriesB";
import ClientsB from "@/components/design-b/sections/ClientsB";
import About from "@/components/sections/About";
import FaqB from "@/components/design-b/sections/FaqB";
import ContactB from "@/components/design-b/sections/ContactB";
import FooterB from "@/components/design-b/sections/FooterB";

/*
  The ProteGo landing page: design B's scroll-driven "Invisible Shield" story and layout,
  with the parts of design A the client liked (Science / How it works, Products, the
  service visuals, the industry explorer, the About timeline and the "+" pattern).
  Spec: docs/specs/2026-09-28-design-b-invisible-shield.md
*/
export default function Home() {
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
        <HowItWorks />
        <Products />
        <ServiceB />
        <HospitalToHomeB />
        <IndustriesB />
        <ClientsB />
        <About />
        <FaqB />
        <ContactB />
      </main>
      <FooterB />
    </>
  );
}
