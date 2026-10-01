import IndustryExplorer from "@/components/IndustryExplorer";
import { Reveal, Words } from "@/components/Motion";

/* Industries: design A's interactive explorer (photos crossfading every 3 s, with high-touch hotspots). */
export default function IndustriesB() {
  return (
    <section id="industries" aria-labelledby="industries-b-title" className="plus-field bg-spring py-16 sm:py-24 lg:py-28" data-fade="bl">
      <div className="wrap">
        <div className="grid gap-4 text-center lg:grid-cols-12 lg:items-end lg:text-left">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-orient">Industries</p>
            <Words id="industries-b-title" text="Every surface. Every day." className="mt-3 text-headline font-normal text-sherpa-deep" />
          </div>
          <Reveal as="p" delay={0.2} className="mx-auto max-w-[28rem] text-lede text-ink/75 lg:col-span-5 lg:mx-0">
            Pick your industry to see what we protect.
          </Reveal>
        </div>
        <Reveal amount={0.15} className="mt-10 sm:mt-14">
          <IndustryExplorer />
        </Reveal>
      </div>
    </section>
  );
}
