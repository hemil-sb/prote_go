"use client";

import { useState } from "react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT } from "@/content/contact";
import { Reveal } from "@/components/Motion";

export default function Contact({ defaultSector }: { defaultSector?: string }) {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState(CONTACT.topics[0]);
  const assessment = topic === CONTACT.topics[0];

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
    <section id="contact" aria-labelledby="contact-title" className="bg-sherpa-deep py-14 sm:py-20 lg:bg-spring lg:py-28">
      <div className="wrap">
        <Reveal
          className="on-dark plus-field grid gap-10 text-white lg:grid-cols-2 lg:gap-16 lg:overflow-hidden lg:rounded-[2.5rem] lg:bg-sherpa-deep lg:p-12"
          data-tone="dark"
          data-fade="tl"
        >
          <div className="flex flex-col text-center lg:text-left">
            <h2 id="contact-title" className="mx-auto max-w-[14ch] text-headline font-normal text-turquoise lg:mx-0">
              Prefer to talk?
            </h2>
            <p className="mx-auto mt-5 max-w-[28rem] text-lede text-white/80 lg:mx-0">Call or email our team directly.</p>
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
                <span>
                  {CONTACT.address}
                  <a
                    href={CONTACT.mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1.5 font-semibold text-turquoise hover:text-white"
                  >
                    Open in Google Maps
                    <ArrowUpRight aria-hidden className="size-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </span>
              </li>
            </ul>
            <div className="mt-8 min-h-[16rem] flex-1 overflow-hidden rounded-[1.5rem] bg-white/[0.04] ring-1 ring-white/10 lg:min-h-[18rem]">
              <iframe
                title="Map showing ProteGo Hygiene at International Infotech Park, Vashi, Navi Mumbai"
                src={CONTACT.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="block size-full min-h-[16rem] border-0 lg:min-h-[18rem]"
              />
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="border-t border-white/15 pt-8 lg:rounded-[1.75rem] lg:border-t-0 lg:bg-white/[0.04] lg:p-8 lg:ring-1 lg:ring-white/10"
          >
            <p className="text-title font-semibold">{assessment ? "Book a free hygiene assessment" : "Send us a message"}</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium sm:col-span-2">
                How can we help?
                <select name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={`${field} appearance-none`}>
                  {CONTACT.topics.map((t) => (
                    <option key={t} className="text-ink">
                      {t}
                    </option>
                  ))}
                </select>
              </label>
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
                <select
                  name="sector"
                  className={`${field} appearance-none`}
                  defaultValue={defaultSector && CONTACT.sectors.includes(defaultSector) ? defaultSector : CONTACT.sectors[0]}
                >
                  {CONTACT.sectors.map((s) => (
                    <option key={s} className="text-ink">
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                Message <span className="text-white/50">(optional)</span>
                <textarea name="message" rows={3} className={field} />
              </label>
            </div>
            <button
              type="submit"
              className="btn mt-7 w-full rounded-full bg-turquoise px-6 py-4 font-semibold text-sherpa-deep hover:bg-white sm:w-auto"
            >
              {assessment ? "Book my assessment" : "Send message"}
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
