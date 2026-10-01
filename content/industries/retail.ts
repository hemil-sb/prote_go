import type { Industry } from "./types";

export const industry: Industry = {
  slug: "retail",
  name: "Retail",
  group: "Workplaces and retail",
  covers: "Shopping centres, lifestyle centres, food courts and retail stores",
  summary:
    "Protection for the handrails, doors and counters every shopper touches, verified with ATP testing.",
  image: {
    src: "/images/industries/retail.jpg",
    alt: "Shoppers walking through a bright shopping centre atrium",
  },
  headline: "Every visit shapes an impression.",
  lede: "From the moment visitors arrive to the moment they leave, they rely on shared surfaces. ProteGo adds up to 30 days of protection per application to those touchpoints, with results you can measure.",
  challenge: {
    title: "Countless touches across every visit.",
    intro:
      "Clean, well-kept shared spaces help visitors feel at ease. But a busy centre sees the same surfaces touched hundreds of times a day.",
    points: [
      {
        title: "Constant contact",
        body: "Escalator handrails, lift buttons and entrance doors are used by a steady stream of visitors from opening to closing.",
      },
      {
        title: "Shared spaces, quick turnover",
        body: "Food court seating, washrooms and information desks are used by many people in quick succession.",
      },
      {
        title: "Protection ends with the clean",
        body: "Routine cleaning removes contamination, but once a surface dries the next touch can bring microbes back.",
      },
    ],
  },
  zones: [
    {
      area: "Entrances and circulation",
      surfaces: [
        "Entrance doors and handles",
        "Escalator handrails",
        "Lift buttons",
        "Stair rails",
      ],
    },
    {
      area: "Customer service",
      surfaces: [
        "Information desks",
        "Customer service counters",
        "Payment terminals",
        "Directory touch screens",
      ],
    },
    {
      area: "Common areas",
      surfaces: [
        "Common seating",
        "Shopping trolley handles",
        "Balustrades",
      ],
    },
    {
      area: "Food court",
      surfaces: [
        "Chair backs and armrests",
        "Self-order kiosk screens",
        "Hand-wash station taps",
      ],
    },
    {
      area: "Washrooms",
      surfaces: [
        "Taps",
        "Flush plates",
        "Soap and towel dispensers",
        "Door handles and cubicle locks",
      ],
    },
  ],
  approach: [
    {
      title: "Show it with Protected Space™",
      body: "Treated sites can display the ProteGo Protected Space™ certificate and decal, with a QR code visitors can scan to verify.",
    },
  ],
  benefits: [
    {
      who: "Centre management",
      body: "A measurable hygiene standard for the shared spaces you run.",
    },
    {
      who: "Visitors",
      body: "Cleaner touchpoints at every step of their visit.",
    },
    {
      who: "Tenants",
      body: "Better-kept common areas that support the experience their own stores offer.",
    },
  ],
  line: "Every surface. Every day.",
  faqs: [
    {
      q: "Is there an option for individual stores?",
      a: "Yes. Smaller stores, kiosks and counters can use the DIY Protection Kit, a 500 ml bottle that covers about 750 sq ft.",
    },
  ],
  contactSector: "Retail, multiplex or gym",
  related: ["multiplexes", "offices", "gyms-spas-and-salons"],
};
