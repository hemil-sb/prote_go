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
  lede: "From the moment visitors arrive to the moment they leave, they rely on shared surfaces. ProteGo adds long-lasting protection to those touchpoints, with results you can measure.",
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
      title: "Assess and plan",
      body: "We look at visitor footfall, operating hours and high-touch areas, then design a programme around your centre.",
    },
    {
      title: "Professional application",
      body: "Trained technicians apply ProteGo with ULV equipment for even coverage. It forms an invisible, bonded Si-QAC layer that disrupts microbes on contact.",
    },
    {
      title: "Verify with ATP testing",
      body: "Readings are taken at set locations before and after application and recorded in a digital report.",
    },
    {
      title: "Show it with Protected Space™",
      body: "Treated sites can display the ProteGo Protected Space™ certificate and decal, with a QR code visitors can scan to verify.",
    },
  ],
  benefits: [
    {
      who: "Centre management",
      body: "A measurable hygiene standard for the shared spaces you run, renewed every 30 days.",
    },
    {
      who: "Visitors",
      body: "Cleaner touchpoints and a visible sign that their comfort has been considered.",
    },
    {
      who: "Tenants",
      body: "Better-kept common areas that support the experience their own stores offer.",
    },
    {
      who: "Portfolio operators",
      body: "One consistent programme and reporting format that can scale across several properties.",
    },
  ],
  line: "Every visit. Every surface.",
  faqs: [
    {
      q: "How long does protection last?",
      a: "Up to 30 days on treated surfaces under normal conditions. Results can vary with cleaning practices, abrasion and environment, which is why we verify with ATP testing.",
    },
    {
      q: "Can we try it in one area first?",
      a: "Yes. Begin with a pilot in one area, such as the washrooms or escalators, review the results, then expand if it suits you.",
    },
    {
      q: "Is there an option for individual stores?",
      a: "Yes. Smaller stores, kiosks and counters can use the DIY Protection Kit, a 500 ml bottle that covers about 750 sq ft.",
    },
  ],
  contactSector: "Retail, multiplex or gym",
  related: ["multiplexes", "offices", "gyms-spas-and-salons"],
};
