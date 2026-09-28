import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/sections/Hero";
import CleaningGap from "@/components/sections/CleaningGap";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyProteGo from "@/components/sections/WhyProteGo";
import Products from "@/components/sections/Products";
import Services from "@/components/sections/Services";
import HospitalToHome from "@/components/sections/HospitalToHome";
import Industries from "@/components/sections/Industries";
import Clients from "@/components/sections/Clients";
import About from "@/components/sections/About";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import SiteFooter from "@/components/sections/SiteFooter";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-orient px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <CleaningGap />
        <HowItWorks />
        <WhyProteGo />
        <Products />
        <Services />
        <HospitalToHome />
        <Industries />
        <Clients />
        <About />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
