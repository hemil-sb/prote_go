// Shape of one industry page (/industries/[slug]). Content comes from docs/knowledge-base/04-industries/.
export const INDUSTRY_GROUPS = [
  "Healthcare",
  "Education",
  "Hospitality and food",
  "Workplaces and retail",
  "Travel and public spaces",
  "Manufacturing",
  "Homes",
] as const;

export type IndustryGroup = (typeof INDUSTRY_GROUPS)[number];

export type Industry = {
  slug: string;
  /** Short name used in nav, cards and breadcrumbs, e.g. "Education" */
  name: string;
  group: IndustryGroup;
  /** Who it covers, e.g. "Schools, colleges and campuses" */
  covers: string;
  /** One sentence for the index card (max ~120 characters). Don't mention "30 days" here. */
  summary: string;
  /** Path under /public, or omitted when no photo is available yet */
  image?: { src: string; alt: string };
  /** Page headline: sentence case, ends with a full stop, max ~8 words */
  headline: string;
  /** 1–2 sentences under the headline. The ONLY place on the page that says "up to 30 days". */
  lede: string;
  /** The problem in this sector */
  challenge: {
    title: string;
    intro: string;
    points: { title: string; body: string }[]; // exactly 3; don't restate the lede
  };
  /** High-touch, non-food-contact surfaces by area */
  zones: { area: string; surfaces: string[] }[]; // 3–6 areas, 3–6 surfaces each
  /**
   * 1–2 notes on what is specific to this sector (e.g. a QA/SOP step, a scope boundary, timing around
   * shows or shifts, a DIY or Hospital to Home™ route). The generic assess → apply → verify → report →
   * renew process is shown once by the page template, so never restate it here.
   */
  approach: { title: string; body: string }[];
  /** What each stakeholder gets */
  benefits: { who: string; body: string }[]; // exactly 3; don't restate the approach
  /** Only real, attributable proof from the knowledge base */
  proof?: { quote: string; source: string };
  /** The brand's own sign-off line for this sector; must not restate the headline */
  line: string;
  /**
   * 1–2 sector-specific questions. Generic ones (does it replace cleaning?, can we pilot?, what does
   * ATP/RLU measure?, how is it tested?) are shared by the template, so never include them.
   */
  faqs: { q: string; a: string }[];
  /** Option label pre-selected in the contact form's "Type of space" */
  contactSector: string;
  /** 2–3 related industry slugs */
  related: string[];
};
