// Managed Protection Programme (same values as design A's Services section)
export const INCLUDED = [
  "Site assessment and surface mapping",
  "Professional ULV application",
  "ATP testing before and after",
  "Digital hygiene report",
  "Protected Space™ certification",
  "Renewal every 30 days",
];

// the brand's 30-day "Continuity Lifecycle"
export const CYCLE = [
  { label: "Assess", body: "Site assessment and surface mapping." },
  { label: "Protect", body: "Professional ULV application." },
  { label: "Verify", body: "ATP testing before and after." },
  { label: "Report", body: "A digital hygiene report and a Protected Space™ certificate." },
  { label: "Renew", body: "Reapplied every 30 days." },
];

export const PLANS: { name: string; price: string; unit: string; points: string[]; featured?: boolean }[] = [
  {
    name: "Professional",
    price: "From ₹2.75",
    unit: "per sq ft a month + GST",
    points: ["Everything in the managed programme", "From 1,500 sq ft", "Minimum 6 months"],
  },
  {
    name: "12-Month",
    price: "Preferential",
    unit: "annual terms",
    points: ["Everything in Professional", "Annual plan and trend reports", "Dedicated account manager"],
    featured: true,
  },
  {
    name: "Long-Term Partnership",
    price: "Custom",
    unit: "proposal",
    points: ["Chains, campuses, developers", "One standard across every site", "Portfolio-wide reporting"],
  },
];
