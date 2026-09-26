import IndustryExplorer from "@/components/IndustryExplorer";
import { Reveal, Words } from "@/components/Motion";

export default function Industries() {
  return (
    <section id="industries" aria-labelledby="industries-title" className="plus-field bg-white" data-fade="bl">
      <div className="wrap py-14 sm:py-20 lg:py-28">
        <div className="grid gap-6 text-center lg:grid-cols-12 lg:items-end lg:text-left">
          <Words
            id="industries-title"
            text="Every surface. Every day."
            className="text-headline font-normal text-sherpa-deep lg:col-span-6"
          />
          <Reveal as="p" delay={0.2} className="mx-auto max-w-[28rem] text-lede text-ink/75 lg:col-span-5 lg:col-start-8 lg:mx-0">
            Pick your industry to see what we protect.
          </Reveal>
        </div>
        <Reveal amount={0.15} className="mt-8 sm:mt-12">
          <IndustryExplorer />
        </Reveal>
      </div>
    </section>
  );
}
