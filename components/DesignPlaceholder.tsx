import Image from "next/image";

/* Stand-in for a landing-page design that hasn't been built yet. */
export default function DesignPlaceholder({ letter }: { letter: string }) {
  return (
    <main className="plus-field flex min-h-dvh flex-col" data-fade="tr">
      <div className="wrap flex h-20 items-center">
        <Image src="/brand/logo-horizontal-dark.svg" alt="ProteGo Hygiene" width={856} height={306} className="h-[52px] w-auto" />
      </div>
      <div className="wrap flex flex-1 flex-col justify-center pb-32">
        <p className="font-semibold text-orient">Design {letter}</p>
        <h1 className="mt-3 text-display font-normal text-sherpa-deep">Coming soon.</h1>
        <p className="mt-6 max-w-[30rem] text-lede text-ink/70">
          This version of the landing page is in progress. Use the switcher below to go back to design A.
        </p>
      </div>
    </main>
  );
}
