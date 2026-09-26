"use client";

import { useState } from "react";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";

const EMAIL = "sales@protegohygiene.com";
const PHONE_DISPLAY = "+91 99670 53755";
const PHONE_HREF = "+919967053755";

const SECTORS = [
  "Hospital or clinic",
  "School or college",
  "Office or business park",
  "Hotel, restaurant or café",
  "Manufacturing or pharma",
  "Retail, multiplex or gym",
  "Transport or government",
  "Home or residential",
  "Something else",
];

export default function Contact() {
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
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const field =
    "mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-turquoise focus:outline-none";

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="on-dark plus-field bg-sherpa text-white"
      data-tone="dark"
      data-fade="tl"
    >
      <div className="wrap grid gap-10 py-14 sm:gap-14 sm:py-20 lg:grid-cols-12 lg:py-28">
        <div className="text-center lg:col-span-6 lg:text-left">
          <Words
            id="contact-title"
            text="So you can focus on what matters."
            className="mx-auto max-w-[12ch] text-headline font-normal lg:mx-0"
          />
          <Reveal as="p" delay={0.2} className="mx-auto mt-6 max-w-[30rem] text-lede text-white/80 sm:mt-8 lg:mx-0">
            Book a complimentary hygiene assessment. No obligation. Just better hygiene.
          </Reveal>
          <Stagger as="dl" delay={0.3} gap={0.1} className="mt-10 space-y-5 sm:mt-12 sm:space-y-6">
            <Item>
              <dt className="text-sm text-sherpa-tint">Email</dt>
              <dd className="mt-1 text-lg font-semibold">
                <a href={`mailto:${EMAIL}`} className="hover:text-turquoise">
                  {EMAIL}
                </a>
              </dd>
            </Item>
            <Item>
              <dt className="text-sm text-sherpa-tint">Office</dt>
              <dd className="mx-auto mt-1 max-w-[22rem] font-semibold leading-snug lg:mx-0">
                K-104, Tower 6, International Infotech Park, Vashi, Navi Mumbai 400 705
              </dd>
            </Item>
            <Item>
              <dt className="text-sm text-sherpa-tint">Phone and WhatsApp</dt>
              <dd className="mt-1 text-lg font-semibold">
                <a href={`tel:${PHONE_HREF}`} className="hover:text-turquoise">
                  {PHONE_DISPLAY}
                </a>
              </dd>
            </Item>
          </Stagger>
        </div>

        <div className="lg:col-span-6">
          <Stagger gap={0.07} amount={0.2}>
            <form onSubmit={onSubmit} className="rounded-[2rem] bg-sherpa-deep p-6 sm:p-10">
              <Item as="h3" className="text-title font-semibold">
                Book a free hygiene assessment
              </Item>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Item as="label" className="block text-sm font-medium">
                  Your name
                  <input name="name" required autoComplete="name" className={field} />
                </Item>
                <Item as="label" className="block text-sm font-medium">
                  Organisation
                  <input name="organisation" autoComplete="organization" className={field} />
                </Item>
                <Item as="label" className="block text-sm font-medium">
                  Phone
                  <input name="phone" type="tel" required autoComplete="tel" className={field} />
                </Item>
                <Item as="label" className="block text-sm font-medium">
                  Type of space
                  <select name="sector" className={`${field} appearance-none`} defaultValue={SECTORS[0]}>
                    {SECTORS.map((s) => (
                      <option key={s} className="text-ink">
                        {s}
                      </option>
                    ))}
                  </select>
                </Item>
              </div>
              <Item>
                <button
                  type="submit"
                  className="mt-8 w-full rounded-full bg-turquoise px-6 py-4 font-semibold text-sherpa-deep btn hover:bg-white sm:w-auto"
                >
                  Book my assessment
                </button>
                <p className="mt-4 text-sm text-sherpa-tint" aria-live="polite">
                  {sent
                    ? "Your email app is open with your details. Send it and we'll be in touch."
                    : "Opens your email app with your details filled in."}
                </p>
              </Item>
            </form>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
