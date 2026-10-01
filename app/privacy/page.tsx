import type { Metadata } from "next";
import { Building2, Clock, Eye, FileText, Mail, RefreshCw, Scale, Settings, ShoppingCart, type LucideIcon } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { IconBadge } from "@/components/site/icons";
import { PRIVACY } from "@/content/privacy";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How the ProteGo Hygiene website handles your information.",
};

const SECTION_ICONS: [RegExp, LucideIcon][] = [
  [/who we are/i, Building2],
  [/collect/i, Eye],
  [/form/i, Mail],
  [/cart|order/i, ShoppingCart],
  [/use/i, Settings],
  [/keep|long/i, Clock],
  [/right/i, Scale],
  [/change/i, RefreshCw],
];
const sectionIcon = (t: string) => SECTION_ICONS.find(([re]) => re.test(t))?.[1] ?? FileText;

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/privacy", label: "Privacy policy" },
        ]}
        title="Privacy policy."
        lede={PRIVACY.intro}
      />
      <section className="bg-white">
        <div className="wrap py-16 sm:py-20">
          <p className="mx-auto max-w-[44rem] rounded-2xl bg-turquoise-tint px-5 py-3 text-sm font-semibold text-sherpa-deep">
            Last updated {PRIVACY.updated}. Draft pending legal review.
          </p>
          <div className="mx-auto mt-10 max-w-[44rem] space-y-12">
            {PRIVACY.sections.map((s) => (
              <section key={s.title} aria-label={s.title}>
                <h2 className="flex items-center gap-3 text-title font-semibold text-sherpa-deep">
                  <IconBadge icon={sectionIcon(s.title)} tone="tint" size="sm" />
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4 text-ink/75">
                  {s.body.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
