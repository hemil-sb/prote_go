import Image from "next/image";
import { Item, Stagger } from "@/components/Motion";

const COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Surface Protectant", href: "#products" },
      { label: "DIY Protection Kit", href: "#products" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Managed protection", href: "#services" },
      { label: "ATP testing", href: "#services" },
      { label: "Protected Space™", href: "#services" },
      { label: "Hospital to Home™", href: "#services" },
      { label: "Digital reports", href: "#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Industries", href: "#industries" },
      { label: "Clients", href: "#clients" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="on-dark plus-field bg-sherpa-deep text-white" data-tone="dark" data-fade="br">
      <div className="wrap py-16 lg:py-20">
        <Stagger gap={0.1} amount={0.2} className="grid gap-12 lg:grid-cols-12">
          <Item className="lg:col-span-3">
            <Image src="/brand/logo-horizontal-white.svg" alt="ProteGo Hygiene" width={168} height={60} className="h-[60px] w-auto" />
            <p className="mt-6 max-w-[22rem] leading-relaxed text-white/70">Holistic hygiene solutions.</p>
          </Item>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6">
            {COLUMNS.map((col) => (
              <Item key={col.title}>
                <h2 className="text-sm font-semibold text-turquoise">{col.title}</h2>
                <ul className="mt-4 space-y-3 text-white/75">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="inline-block transition-[color,translate] duration-200 hover:translate-x-1 hover:text-white"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Item>
            ))}
          </nav>

          <Item className="lg:col-span-3">
            <h2 className="text-sm font-semibold text-turquoise">Get in touch</h2>
            <address className="mt-4 space-y-3 not-italic text-white/75">
              <p>
                <a href="mailto:sales@protegohygiene.com" className="hover:text-white">
                  sales@protegohygiene.com
                </a>
              </p>
              <p>
                <a href="tel:+919967053755" className="hover:text-white">
                  +91 99670 53755
                </a>
              </p>
              <p>
                ProteGo Hygiene Pvt. Ltd.
                <br />
                K-104, Tower 6, International Infotech Park,
                <br />
                Vashi, Navi Mumbai 400 705
              </p>
            </address>
          </Item>
        </Stagger>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-8 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} ProteGo Hygiene Pvt. Ltd. All rights reserved.</p>
          <p className="max-w-[40rem]">
            Protection lasts up to 30 days on treated surfaces under normal conditions. ProteGo complements routine cleaning; it does not
            replace it.
          </p>
        </div>
      </div>
    </footer>
  );
}
