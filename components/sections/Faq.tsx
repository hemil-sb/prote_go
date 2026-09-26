import { Item, Stagger, Words } from "@/components/Motion";

const FAQS = [
  {
    q: "Why protect a surface that's just been cleaned?",
    a: "Disinfectants stop working once they dry. The next touch can bring germs straight back. ProteGo keeps working in between.",
  },
  {
    q: "Does it replace cleaning?",
    a: "No. Clean as usual. ProteGo protects surfaces between cleans.",
  },
  {
    q: "Is it safe?",
    a: "About 98% water, non-leaching and non-flammable. Treated spaces are ready once dry, in about an hour.",
  },
  {
    q: "How do I know it's working?",
    a: "We ATP test surfaces before and after every application and share the readings.",
  },
];

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="plus-field" data-fade="bl">
      <div className="wrap py-14 sm:py-20 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Words id="faq-title" text="FAQs" className="text-center text-headline font-normal text-sherpa-deep lg:col-span-4 lg:text-left" />
          <Stagger gap={0.08} className="border-t border-ink/15 lg:col-span-8">
            {FAQS.map((f) => (
              <Item key={f.q} className="border-b border-ink/15">
                <details className="faq group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-semibold text-sherpa-deep sm:py-6 sm:text-lg transition-colors hover:text-orient [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5 shrink-0 text-orient transition-[rotate] duration-300 group-open:rotate-45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </summary>
                  <p className="max-w-[40rem] pb-7 text-ink/70">{f.a}</p>
                </details>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
