import Image from "next/image";

export default function FooterC() {
  return (
    <footer className="on-dark bg-sherpa-deep text-white">
      <div className="wrap py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Image src="/brand/logo-horizontal-white.svg" alt="ProteGo Hygiene" width={856} height={307} className="h-[56px] w-auto" />
            <p className="mt-6 text-lede text-white/80">So you can focus on what matters.</p>
          </div>
          <address className="space-y-2 not-italic text-white/75 lg:col-span-4 lg:col-start-7">
            <p>
              <a href="mailto:sales@protegohygiene.com" className="hover:text-white">
                sales@protegohygiene.com
              </a>
            </p>
            <p>
              <a href="tel:+919967053755" className="hover:text-white">
                +91 99670 53755
              </a>
            </p>
            <p>ProteGo Hygiene Pvt. Ltd., K-104, Tower 6, International Infotech Park, Vashi, Navi Mumbai 400 705</p>
          </address>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-8 text-sm text-white/55 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} ProteGo Hygiene Pvt. Ltd.</p>
          <p className="max-w-[40rem]">
            Protection lasts up to 30 days on treated surfaces under normal conditions. ProteGo complements routine cleaning; it does not
            replace it. The touch test on this page is an illustration, not lab data.
          </p>
        </div>
      </div>
    </footer>
  );
}
