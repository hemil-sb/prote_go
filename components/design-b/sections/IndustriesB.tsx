import { INDUSTRIES } from "@/content/industries";
import { Item, Stagger, Words } from "@/components/Motion";

export default function IndustriesB() {
  return (
    <section id="industries" aria-labelledby="industries-b-title" className="bg-spring py-16 sm:py-24 lg:py-28">
      <div className="wrap">
        <div className="text-center lg:text-left">
          <p className="text-sm font-semibold tabular-nums text-orient">Industries</p>
          <Words id="industries-b-title" text="Every surface. Every day." className="mt-3 text-headline font-normal text-sherpa-deep" />
        </div>
        <Stagger as="ul" gap={0.07} className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map(({ icon: Icon, name, covers, hotspots }) => (
            <Item
              as="li"
              key={name}
              className="group flex flex-col rounded-[2rem] bg-white p-7 ring-1 ring-spring-deep transition-shadow duration-300 hover:shadow-[0_24px_48px_-28px_rgb(13_44_51/0.4)]"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-sherpa-deep text-turquoise transition-[rotate] duration-300 group-hover:-rotate-6">
                <Icon aria-hidden className="size-6" strokeWidth={1.6} />
              </span>
              <p className="mt-6 text-title font-semibold text-sherpa-deep">{name}</p>
              <p className="mt-1 text-sm text-ink/60">{covers}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {hotspots.slice(0, 3).map((h) => (
                  <li key={h} className="rounded-full bg-turquoise-tint px-3 py-1 text-xs font-semibold text-sherpa">
                    {h}
                  </li>
                ))}
              </ul>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
