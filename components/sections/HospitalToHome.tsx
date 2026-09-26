import Image from "next/image";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";
import { Accessibility, Bath, BedDouble, DoorOpen, Smartphone, Tv } from "lucide-react";

const TOUCHPOINTS = [
  { icon: DoorOpen, label: "Door handles" },
  { icon: BedDouble, label: "Bed rails" },
  { icon: Bath, label: "Bathroom fittings" },
  { icon: Tv, label: "Remotes" },
  { icon: Smartphone, label: "Phones" },
  { icon: Accessibility, label: "Walking aids" },
];

export default function HospitalToHome() {
  return (
    <section aria-labelledby="h2h-title" className="wrap pb-14 sm:pb-20 lg:pb-28">
      <Reveal as="article" amount={0.2} className="on-dark grid overflow-hidden rounded-[2rem] bg-sherpa-deep text-white lg:grid-cols-2">
        <div className="relative min-h-[240px] overflow-hidden sm:min-h-[300px]">
          <Item effect="zoom" duration={1.6} className="absolute inset-0">
            <Image
              src="/images/caregiver-elderly.jpg"
              alt="A caregiver supporting an elderly person as they walk"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </Item>
        </div>
        <div className="p-6 text-center sm:p-12 lg:p-14 lg:text-left">
          <Reveal as="p" effect="fade" delay={0.2} className="font-semibold text-turquoise">
            Hospital to Home™
          </Reveal>
          <Words id="h2h-title" delay={0.3} text="Recovery deserves a safer home." className="mt-3 text-headline font-normal" />
          <Reveal as="p" delay={0.45} className="mx-auto mt-5 max-w-[28rem] text-white/80 lg:mx-0">
            We protect the surfaces a recovering patient touches most, before they come home.
          </Reveal>
          <Stagger as="ul" delay={0.5} gap={0.07} className="mt-8 grid grid-cols-3 gap-3">
            {TOUCHPOINTS.map(({ icon: Icon, label }) => (
              <Item
                as="li"
                key={label}
                effect="pop"
                className="group rounded-xl bg-white/[0.07] px-3 py-4 text-center transition-colors hover:bg-white/[0.12]"
              >
                <Icon
                  aria-hidden
                  className="mx-auto size-6 text-turquoise transition-[translate] duration-300 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
                <p className="mt-2 text-xs font-semibold text-white/85">{label}</p>
              </Item>
            ))}
          </Stagger>
          <a
            href="#contact"
            className="mt-8 inline-block rounded-full bg-turquoise px-6 py-3.5 font-semibold text-sherpa-deep btn hover:bg-white"
          >
            Talk to us about a home visit
          </a>
        </div>
      </Reveal>
    </section>
  );
}
