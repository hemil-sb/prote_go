import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import SectionIntro from "@/components/site/SectionIntro";
import CtaBand from "@/components/site/CtaBand";
import { Extras, PilotBanner, Plans, PRICING_NOTE, ProgrammeCard, ProofCards } from "@/components/sections/Services";
import Link from "next/link";
import { ArrowRight, ClipboardList, FileText, Gauge, IndianRupee } from "lucide-react";
import Faq from "@/components/sections/Faq";

export const metadata: Metadata = {
  title: "Services",
  description:
    "The ProteGo Managed Protection Programme: site assessment, professional ULV application, ATP testing before and after, a digital report and renewal every 30 days. From ₹2.75 per sq ft a month.",
};

const SERVICE_FAQS = [
  {
    q: "Will it disrupt our operations?",
    a: "Application is quick and treated areas are ready once dry, in about an hour. We plan visits around your hours.",
  },
  { q: "Does it replace our housekeeping?", a: "No. Your team cleans as usual. ProteGo protects surfaces between cleans." },
  {
    q: "What is a Protected Space™?",
    a: "A site under an active ProteGo programme. You receive a certificate and decal to display, with a “Scan to verify” QR code for your visitors.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
        ]}
        title="Science that protects. Data that proves it."
        lede="Science-backed. Independently tested. Professionally delivered."
        actions={[
          { href: "/contact", label: "Book a free assessment" },
          { href: "#plans", label: "See plans and pricing" },
        ]}
        highlights={[
          { icon: ClipboardList, value: "Free assessment", label: "of your site" },
          { icon: Gauge, value: "ATP readings", label: "before and after" },
          { icon: FileText, value: "Digital report", label: "after every visit" },
        ]}
        image={{ src: "/images/hand-bottle-counter.jpg", alt: "A hand placing a teal spray bottle on a bathroom counter" }}
        card={{
          icon: IndianRupee,
          title: "From ₹2.75 per sq ft a month",
          text: "Plus GST. Indicative, confirmed after your site assessment.",
        }}
      />

      {/* the programme */}
      <section aria-labelledby="programme-title" className="plus-field bg-spring" data-fade="tl">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <SectionIntro
            id="programme-title"
            title="One programme. Every 30 days."
            lede="Everything included, from the first walk-through to the renewal."
          />
          <ProgrammeCard className="mt-10 sm:mt-14" />
        </div>
      </section>

      {/* proof */}
      <section aria-labelledby="proof-title" className="bg-white">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <SectionIntro
            id="proof-title"
            title="Proof after every visit."
            lede="Readings you can check, a certificate your visitors can scan and a report for your records."
            link={{ href: "/how-it-works", label: "How ATP testing works" }}
          />
          <ProofCards className="mt-10 sm:mt-14" />
          <Extras className="mt-8" />
        </div>
      </section>

      {/* plans */}
      <section id="plans" aria-labelledby="plans-title" className="plus-field bg-spring" data-fade="br">
        <div className="wrap py-16 sm:py-24 lg:py-28">
          <SectionIntro
            id="plans-title"
            title="Choose your protection programme."
            lede="Start with a pilot, then choose the term that suits your site."
          />
          <Plans className="mt-10 sm:mt-14" />
          <PilotBanner className="mt-6" />
          <p className="mt-4 text-center text-sm text-ink/55 sm:text-left">{PRICING_NOTE}</p>
        </div>
      </section>

      {/* Hospital to Home™ has its own page; one line here */}
      <section aria-label="Hospital to Home™" className="bg-white">
        <div className="wrap pb-4 pt-12 sm:pt-16">
          <Link
            href="/hospital-to-home"
            className="group flex flex-col items-center justify-between gap-3 rounded-[2rem] bg-turquoise-tint p-6 text-center sm:flex-row sm:p-8 sm:text-left"
          >
            <span>
              <span className="block text-sm font-semibold text-orient">Hospital to Home&trade;</span>
              <span className="mt-1 block text-title font-semibold text-sherpa-deep">Protecting the home after a hospital stay.</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-orient group-hover:text-sherpa-deep">
              Learn more
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>
      <Faq items={SERVICE_FAQS} id="service-faq" tone="white" />
      <CtaBand
        title="Ready when you are."
        body="Tell us about your site and we'll suggest a plan, or start with a pilot in one area."
        secondary={null}
      />
    </>
  );
}
