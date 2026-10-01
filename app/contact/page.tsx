import type { Metadata } from "next";
import { BadgeCheck, ClipboardList, Gauge } from "lucide-react";
import { CONTACT } from "@/content/contact";
import PageHero from "@/components/site/PageHero";
import Contact from "@/components/sections/Contact";
import Faq from "@/components/sections/Faq";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a free hygiene assessment with ProteGo Hygiene. Call +91 99670 53755 or email sales@protegohygiene.com.",
};

export default async function ContactPage(props: PageProps<"/contact">) {
  const { sector } = await props.searchParams;
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/contact", label: "Contact" },
        ]}
        title="Book a free hygiene assessment."
        lede="We visit, map your high-touch surfaces and take ATP readings, then suggest a plan."
        actions={[
          { href: "#contact", label: "Fill in the form" },
          { href: `tel:${CONTACT.phoneHref}`, label: `Call ${CONTACT.phoneDisplay}` },
        ]}
        highlights={[
          { icon: BadgeCheck, value: "Free", label: "no obligation" },
          { icon: ClipboardList, value: "Site walk-through", label: "high-touch mapping" },
          { icon: Gauge, value: "ATP readings", label: "on the day" },
        ]}
      />
      <Contact defaultSector={typeof sector === "string" ? sector : undefined} />
      <Faq tone="white" />
    </>
  );
}
