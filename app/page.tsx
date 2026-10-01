import ShieldStory from "@/components/design-b/ShieldStory";
import Products from "@/components/sections/Products";
import Services from "@/components/sections/Services";
import HospitalToHome from "@/components/sections/HospitalToHome";
import Industries from "@/components/sections/Industries";
import Clients from "@/components/sections/Clients";
import CtaBand from "@/components/site/CtaBand";

/*
  Home: the scroll-driven "Invisible Shield" story (it already tells clean → apply → bond →
  protect → verify, so the step-by-step How it works lives only on /how-it-works), then short
  previews that lead to the full pages.
  Story spec: docs/specs/2026-09-28-design-b-invisible-shield.md
*/
export default function Home() {
  return (
    <>
      <ShieldStory />
      <Products />
      <Services />
      <HospitalToHome />
      <Industries />
      <Clients />
      <CtaBand tone="white" secondary={{ href: "/about", label: "About ProteGo" }} />
    </>
  );
}
