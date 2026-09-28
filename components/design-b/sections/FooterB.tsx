import Image from "next/image";
import { CONTACT } from "@/content/contact";

const LINKS = [
  { href: "#story", label: "How it works" },
  { href: "#products", label: "Product" },
  { href: "#service", label: "Service" },
  { href: "#industries", label: "Industries" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
];

export default function FooterB() {
  return (
    <footer className="on-dark border-t border-white/10 bg-sherpa-deep text-white">
      <div className="wrap flex flex-col gap-10 py-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="text-center lg:text-left">
          <Image
            src="/brand/logo-horizontal-white.svg"
            alt="ProteGo Hygiene"
            width={856}
            height={307}
            className="mx-auto h-12 w-auto lg:mx-0"
          />
          <p className="mt-4 text-sm text-white/65">So you can focus on what matters.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-white/75 lg:justify-end">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-turquoise">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-sm text-white/65 lg:text-right">
            <a href={`mailto:${CONTACT.email}`} className="hover:text-turquoise">
              {CONTACT.email}
            </a>{" "}
            ·{" "}
            <a href={`tel:${CONTACT.phoneHref}`} className="hover:text-turquoise">
              {CONTACT.phoneDisplay}
            </a>
          </p>
        </nav>
      </div>
      <div className="wrap flex flex-col gap-3 border-t border-white/10 py-6 pb-24 text-center text-xs text-white/50 sm:pb-24 lg:flex-row lg:justify-between lg:text-left">
        <p>&copy; {new Date().getFullYear()} ProteGo Hygiene Pvt. Ltd.</p>
        <p className="max-w-[40rem]">
          Protection lasts up to 30 days on treated surfaces under normal conditions. ProteGo complements routine cleaning; it does not
          replace it.
        </p>
      </div>
    </footer>
  );
}
