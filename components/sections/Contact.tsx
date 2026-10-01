"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT } from "@/content/contact";
import { Reveal } from "@/components/Motion";

export default function ContactB() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = `Free hygiene assessment: ${data.get("organisation") || data.get("name")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Organisation: ${data.get("organisation")}`,
      `Phone: ${data.get("phone")}`,
      `Type of space: ${data.get("sector")}`,
    ].join("\n");
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const field =
    "mt-2 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white placeholder:text-white/40 focus:border-turquoise focus:outline-none";

  return (
    <section id="contact" aria-labelledby="contact-b-title" className="bg-sherpa-deep py-14 sm:py-20 lg:bg-spring lg:py-28">
      <div className="wrap">
        <Reveal
          className="on-dark plus-field grid gap-10 text-white lg:grid-cols-2 lg:gap-16 lg:overflow-hidden lg:rounded-[2.5rem] lg:bg-sherpa-deep lg:p-12"
          data-tone="dark"
          data-fade="tl"
        >
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold tabular-nums text-turquoise">Contact</p>
            <h2 id="contact-b-title" className="mx-auto mt-3 max-w-[14ch] text-headline font-normal lg:mx-0">
              So you can focus on what matters.
            </h2>
            <p className="mx-auto mt-5 max-w-[28rem] text-lede text-white/80 lg:mx-0">
              Book a complimentary hygiene assessment. No obligation. Just better hygiene.
            </p>
            <ul className="mx-auto mt-8 max-w-[24rem] space-y-3 text-left lg:mx-0">
              <li className="flex items-start gap-3">
                <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-turquoise" strokeWidth={1.8} />
                <a href={`mailto:${CONTACT.email}`} className="font-semibold hover:text-turquoise">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone aria-hidden className="mt-0.5 size-5 shrink-0 text-turquoise" strokeWidth={1.8} />
                <a href={`tel:${CONTACT.phoneHref}`} className="font-semibold hover:text-turquoise">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-turquoise" strokeWidth={1.8} />
                {CONTACT.address}
              </li>
            </ul>
          </div>

          <form onSubmit={onSubmit} className="border-t border-white/15 pt-8 lg:rounded-[1.75rem] lg:border-t-0 lg:bg-white/[0.04] lg:p-8 lg:ring-1 lg:ring-white/10">
            <p className="text-title font-semibold">Book a free hygiene assessment</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Your name
                <input name="name" required autoComplete="name" className={field} />
              </label>
              <label className="block text-sm font-medium">
                Organisation
                <input name="organisation" autoComplete="organization" className={field} />
              </label>
              <label className="block text-sm font-medium">
                Phone
                <input name="phone" type="tel" required autoComplete="tel" className={field} />
              </label>
              <label className="block text-sm font-medium">
                Type of space
                <select name="sector" className={`${field} appearance-none`} defaultValue={CONTACT.sectors[0]}>
                  {CONTACT.sectors.map((s) => (
                    <option key={s} className="text-ink">
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="submit"
              className="btn mt-7 w-full rounded-full bg-turquoise px-6 py-4 font-semibold text-sherpa-deep hover:bg-white sm:w-auto"
            >
              Book my assessment
            </button>
            <p className="mt-4 text-sm text-sherpa-tint" aria-live="polite">
              {sent
                ? "Your email app is open with your details. Send it and we'll be in touch."
                : "Opens your email app with your details filled in."}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
