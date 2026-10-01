// ProteGo Surface Protectant packs (docs/knowledge-base/03-offerings/surface-protectant.md, diy-protection-kit.md).
// Only the 500 ml DIY kit has a current MRP. The 20 L MRP (₹32,599) is from a Dec 2024, pre-rebrand label,
// so it is shown as "price on request" until the client confirms it.

export type Product = {
  slug: string;
  name: string;
  size: string;
  /** MRP in rupees, inclusive of taxes; null = price on request */
  price: number | null;
  coverage: string;
  bestFor: string;
  image: { src: string; alt: string };
  summary: string;
  idealFor: string[];
  inTheBox: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "surface-protectant-100ml",
    name: "ProteGo Surface Protectant",
    size: "100 ml",
    price: null,
    coverage: "Small spaces",
    bestFor: "Personal use",
    image: { src: "/products/protego-100ml.jpg", alt: "ProteGo Surface Protectant, 100 ml spray bottle" },
    summary: "A pocket-sized spray for the surfaces you touch most: your desk, phone, car and travel essentials.",
    idealFor: ["Desks and workstations", "Phones and remotes", "Car door handles and steering wheels", "Travel"],
    inTheBox: ["100 ml ready-to-use spray bottle", "Instructions for use"],
  },
  {
    slug: "diy-protection-kit-500ml",
    name: "DIY Protection Kit",
    size: "500 ml",
    price: 1049,
    coverage: "About 750 sq ft",
    bestFor: "Homes, cafés, studios and small offices",
    image: { src: "/products/protego-500ml.jpg", alt: "ProteGo Surface Protectant, 500 ml trigger-spray bottle" },
    summary: "The protectant our teams use, applied by you. One bottle covers about 750 sq ft for up to 30 days.",
    idealFor: ["Homes and caregivers", "Independent cafés and small restaurants", "Salons, studios and small gyms", "Small offices, clinics and counters"],
    inTheBox: ["500 ml ready-to-use trigger spray", "Instructions for use"],
  },
  {
    slug: "surface-protectant-20l",
    name: "ProteGo Surface Protectant",
    size: "20 L",
    price: null,
    coverage: "About 30,000 sq ft",
    bestFor: "Facilities, housekeeping teams and partners",
    image: { src: "/products/protego-20l.jpg", alt: "ProteGo Surface Protectant, 20 litre bulk can" },
    summary: "The bulk pack for facilities that apply in-house with ULV equipment, across large areas.",
    idealFor: ["Hospitals, campuses and offices", "Hotels and malls", "Facility management partners", "In-house housekeeping teams"],
    inTheBox: ["20 L ready-to-use bulk can", "Application guidance"],
  },
];

/** Shared facts for every pack (safe claim set, see claims-register.md) */
export const PRODUCT_FACTS = [
  { label: "Protection", value: "Up to 30 days per application" },
  { label: "Technology", value: "Si-QAC, a silane-bonded quaternary ammonium compound" },
  { label: "Format", value: "Ready to use. No dilution" },
  { label: "Composition", value: "About 98% water" },
  { label: "Drying time", value: "About 1 hour" },
  { label: "Properties", value: "Non-leaching, non-flammable" },
  { label: "Testing", value: "Efficacy tested by an NABL-accredited laboratory" },
  { label: "Use on", value: "Hard, non-food-contact, high-touch surfaces" },
];

export const HOW_TO_USE = [
  { title: "Clean", body: "Clean and dry the surface as usual." },
  { title: "Spray", body: "Spray an even, light coat. No dilution and no wiping needed." },
  { title: "Dry", body: "Leave it to dry for about an hour." },
  { title: "Renew", body: "Reapply every 30 days, or sooner on heavily used surfaces." },
];

export const PRODUCT_NOTE =
  "Protection lasts up to 30 days on treated surfaces under normal conditions. ProteGo complements routine cleaning; it does not replace it.";

export const ALSO_AVAILABLE = "Also available in 5 L. Ask us for bulk and trade pricing.";

export function productBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}
