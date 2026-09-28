import { FAQS } from "@/content/faqs";
import { Item, Stagger, Words } from "@/components/Motion";

export default function FaqB() {
  return (
    <section id="faq" aria-labelledby="faq-b-title" className="bg-white py-16 sm:py-24 lg:py-28">
      <div className="wrap grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="text-center lg:col-span-4 lg:text-left">
          <Words id="faq-b-title" text="FAQ" className="text-headline font-normal text-sherpa-deep" />
        </div>
        <Stagger gap={0.08} className="space-y-3 lg:col-span-8">
          {FAQS.map((f) => (
            <Item key={f.q} className="rounded-[1.5rem] bg-spring px-6 ring-1 ring-spring-deep">
              <details className="faq group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-semibold text-sherpa-deep transition-colors hover:text-orient sm:text-lg [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-sherpa-deep text-turquoise transition-[rotate] duration-300 group-open:rotate-45"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="max-w-[40rem] pb-6 text-ink/70">{f.a}</p>
              </details>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
