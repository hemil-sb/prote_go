import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT } from "@/content/contact";
import { FOOTER_COLUMNS } from "@/content/site";

export default function SiteFooter() {
  return (
    <footer className="on-dark plus-field border-t border-white/10 bg-sherpa-deep text-white" data-tone="dark" data-fade="tr">
      <div className="wrap grid gap-12 py-14 sm:py-16 lg:grid-cols-12">
        <div className="text-center lg:col-span-4 lg:text-left">
          <Link href="/" aria-label="ProteGo Hygiene home" className="inline-block">
            <Image src="/brand/logo-horizontal-white.svg" alt="ProteGo Hygiene" width={856} height={307} className="h-12 w-auto" />
          </Link>
          <p className="mt-5 text-title font-normal text-turquoise">So you can focus on what matters.</p>
          <ul className="mx-auto mt-6 max-w-[22rem] space-y-3 text-left text-sm text-white/75 lg:mx-0">
            <li className="flex items-start gap-3">
              <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-turquoise" strokeWidth={1.8} />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-turquoise">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-turquoise" strokeWidth={1.8} />
              <a href={`tel:${CONTACT.phoneHref}`} className="hover:text-turquoise">
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-turquoise" strokeWidth={1.8} />
              {CONTACT.address}
            </li>
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-7 lg:col-start-6">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-turquoise">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/75">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="wrap flex flex-col gap-3 border-t border-white/10 py-6 pb-10 text-center text-xs text-white/50 lg:flex-row lg:justify-between lg:text-left">
        <p>&copy; {new Date().getFullYear()} ProteGo Hygiene Pvt. Ltd.</p>
        <p className="max-w-[40rem]">
          Protection lasts up to 30 days on treated surfaces under normal conditions. ProteGo complements routine cleaning; it does not
          replace it.
        </p>
      </div>
    </footer>
  );
}
