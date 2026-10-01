import type { Industry } from "./types";

export const industry: Industry = {
  slug: "food-service",
  name: "Food service",
  group: "Hospitality and food",
  covers: "QSRs, cloud kitchens, cafés and local eateries",
  summary: "Protection for counters, kiosks and handles across your outlets, with ATP-verified reports.",
  image: {
    src: "/images/cafe-table-cleaning.jpg",
    alt: "A café worker wiping down a table",
  },
  headline: "Every meal begins with every surface.",
  lede: "Ordering counters, kiosks and door handles are touched all day. ProteGo protects hard, non-food-contact surfaces between cleans, for up to 30 days.",
  challenge: {
    title: "Food safety doesn't end in the kitchen.",
    intro:
      "Food businesses already follow documented hygiene practices. But on a shared surface, a fresh clean lasts only until the next touch.",
    points: [
      {
        title: "A busy customer journey.",
        body: "Arrival, ordering counter, kiosk, payment, table, washroom and exit: each step adds shared surfaces.",
      },
      {
        title: "Documentation is expected.",
        body: "FSSAI requires food businesses to keep documented food safety management systems based on good hygiene practices.",
      },
      {
        title: "Reviews travel fast.",
        body: "Customers notice cleanliness, and online reviews and word of mouth reflect it.",
      },
    ],
  },
  zones: [
    {
      area: "Ordering and payment",
      surfaces: ["Ordering counters", "Self-order kiosks", "POS machines", "Payment terminals", "Menu holders"],
    },
    {
      area: "Dining area",
      surfaces: ["Tabletops", "Chair backs", "Tray return stations", "Entrance door handles"],
    },
    {
      area: "Delivery and pick-up",
      surfaces: ["Pick-up counters", "Door handles and push plates", "Switches and controls"],
    },
    {
      area: "Back of house (non-food-contact)",
      surfaces: ["Refrigerator and freezer handles", "Storage room handles", "Light switches", "Waste bin lids"],
    },
    {
      area: "Washrooms",
      surfaces: ["Taps", "Flush buttons", "Door handles", "Counters"],
    },
  ],
  approach: [
    {
      title: "One café or a whole network.",
      body: "Choose the DIY Protection Kit for a single café, or a managed programme for chains and cloud-kitchen networks.",
    },
  ],
  benefits: [
    {
      who: "Customers",
      body: "Protected surfaces at the counter, kiosk and table, and visible care they can notice.",
    },
    {
      who: "Owners and outlet managers",
      body: "Documented ATP results that support audits, inspections and your hygiene records.",
    },
    {
      who: "Chains and franchise operators",
      body: "One standard across every outlet, with reports you can compare branch by branch.",
    },
  ],
  line: "In food service, hygiene is a front-line promise.",
  faqs: [
    {
      q: "Is ProteGo safe to use near food?",
      a: "It is designed only for hard, non-food-contact surfaces. Never apply it to food, ingredients, utensils, cookware or any surface that comes into direct contact with food.",
    },
    {
      q: "How does it fit with FSSAI requirements?",
      a: "ProteGo does not certify compliance. Its ATP results and digital reports add documented verification to the GHP and FSMS records you already keep.",
    },
  ],
  contactSector: "Hotel, restaurant or café",
  related: ["restaurants-and-banquets", "food-manufacturing", "retail"],
};
