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
  /** One sentence for the index card (max ~120 characters) */
  summary: string;
  /** Path under /public, or omitted when no photo is available yet */
  image?: { src: string; alt: string };
  /** Page headline: sentence case, ends with a full stop, max ~8 words */
  headline: string;
  /** 1–2 sentences under the headline */
  lede: string;
  /** The problem in this sector */
  challenge: {
    title: string;
    intro: string;
    points: { title: string; body: string }[]; // 3–5
  };
  /** High-touch, non-food-contact surfaces by area */
  zones: { area: string; surfaces: string[] }[]; // 3–6 areas, 3–6 surfaces each
  /** How ProteGo helps here */
  approach: { title: string; body: string }[]; // 3–4
  /** What each stakeholder gets */
  benefits: { who: string; body: string }[]; // 3–4
  /** Only real, attributable proof from the knowledge base */
  proof?: { quote: string; source: string };
  /** The brand's own sign-off line for this sector */
  line: string;
  faqs: { q: string; a: string }[]; // 2–4
  /** Option label pre-selected in the contact form's "Type of space" */
  contactSector: string;
  /** 2–3 related industry slugs */
  related: string[];
};
