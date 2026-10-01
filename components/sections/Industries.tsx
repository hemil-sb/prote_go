import IndustryExplorer from "@/components/IndustryExplorer";
import SectionIntro from "@/components/site/SectionIntro";
import ExploreLink from "@/components/site/ExploreLink";
import { Reveal } from "@/components/Motion";

/* Industries: design A's interactive explorer (photos crossfading every 3 s, with high-touch hotspots). */
export default function Industries() {
  return (
    <section id="industries" aria-labelledby="industries-title" className="plus-field bg-spring py-16 sm:py-24 lg:py-28" data-fade="bl">
      <div className="wrap">
        <SectionIntro
          id="industries-title"
          eyebrow="Industries"
          title="Every surface. Every day."
          lede="Pick your industry to see what we protect."
        />
        <Reveal amount={0.15} className="mt-10 sm:mt-14">
          <IndustryExplorer />
        </Reveal>
        <Reveal className="mt-12 flex justify-center lg:justify-start">
          <ExploreLink href="/industries">Explore all 15 industries</ExploreLink>
        </Reveal>
      </div>
    </section>
  );
}
