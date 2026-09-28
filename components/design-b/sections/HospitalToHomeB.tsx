import Image from "next/image";
import { Accessibility, Bath, BedDouble, DoorOpen, Smartphone, Tv } from "lucide-react";
import { Item, Reveal, Stagger, Words } from "@/components/Motion";

/* Hospital to Home™, ProteGo's post-discharge programme (its own section: it is a service, not "about us"). */
const TOUCHPOINTS = [
  { icon: DoorOpen, label: "Door handles" },
  { icon: BedDouble, label: "Bed rails" },
  { icon: Bath, label: "Bathroom fittings" },
  { icon: Tv, label: "Remotes" },
  { icon: Smartphone, label: "Phones" },
  { icon: Accessibility, label: "Walking aids" },
];

export default function HospitalToHomeB() {
  return (
    <section id="hospital-to-home" aria-labelledby="h2h-b-title" className="bg-white py-16 sm:py-24 lg:py-28">
      <div className="wrap">
        <Reveal className="grid overflow-hidden rounded-[2rem] bg-turquoise-tint lg:grid-cols-2">
          <div className="relative min-h-[260px] sm:min-h-[340px]">
            <Image
              src="/images/caregiver-elderly.jpg"
              alt="A caregiver supporting an elderly person as they walk"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8 text-center sm:p-12 lg:text-left">
            <p className="text-sm font-semibold text-orient">Hospital to Home™</p>
            <Words id="h2h-b-title" text="Recovery deserves a safer home." className="mt-3 text-headline font-normal text-sherpa-deep" />
            <p className="mx-auto mt-4 max-w-[30rem] text-lede text-ink/70 lg:mx-0">
              We protect the surfaces a recovering patient touches most, before they come home.
            </p>
            <Stagger as="ul" gap={0.06} className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              {TOUCHPOINTS.map(({ icon: Icon, label }) => (
                <Item as="li" key={label} effect="pop" className="rounded-2xl bg-white px-2 py-4 text-center">
                  <Icon aria-hidden className="mx-auto size-6 text-sherpa" strokeWidth={1.5} />
                  <p className="mt-2 text-xs font-semibold text-sherpa-deep sm:text-sm">{label}</p>
                </Item>
              ))}
            </Stagger>
            <a
              href="#contact"
              className="btn mt-8 self-center rounded-full bg-sherpa-deep px-6 py-3.5 font-semibold text-white hover:bg-sherpa lg:self-start"
            >
              Talk to us about a home visit
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
