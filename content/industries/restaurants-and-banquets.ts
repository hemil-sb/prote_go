import type { Industry } from "./types";

export const industry: Industry = {
  slug: "restaurants-and-banquets",
  name: "Restaurants and banquets",
  group: "Hospitality and food",
  covers: "Restaurants, pubs, clubs, lounges and banquets",
  summary: "Protection for the tables, counters and handles guests touch, verified after every application.",
  image: {
    src: "/images/industries/restaurants.jpg",
    alt: "A softly lit restaurant dining room set for service",
  },
  headline: "Every guest notices cleanliness.",
  lede: "From the host stand to the washroom, every surface shapes how guests feel. ProteGo protects hard, non-food-contact surfaces between cleans, for up to 30 days.",
  challenge: {
    title: "Risk isn't limited to the kitchen.",
    intro:
      "Your team cleans before, during and after service. But guest-facing surfaces are touched constantly, and the next touch can recontaminate a freshly wiped surface.",
    points: [
      {
        title: "Every touchpoint matters.",
        body: "Arrival, host stand, bar, table, washroom, payment and exit: the guest journey is full of shared surfaces.",
      },
      {
        title: "Sanitiser stops when it dries.",
        body: "Repeated wiping protects a surface only for a short time, and it takes effort every shift.",
      },
      {
        title: "Inspections happen.",
        body: "Health inspections and internal audits ask for consistent practice and clear records.",
      },
      {
        title: "Reviews follow experience.",
        body: "Guests notice the details, and what they notice shapes ratings and repeat visits.",
      },
    ],
  },
  zones: [
    {
      area: "Entrance and host stand",
      surfaces: ["Entrance door handles", "Host desk", "Menu folders", "Wine lists"],
    },
    {
      area: "Bar and lounge",
      surfaces: ["Bar counters", "Bar stool backs", "Service stations", "Handrails"],
    },
    {
      area: "Dining room",
      surfaces: ["Tabletops", "Chairs", "Napkin dispensers", "Table accessories"],
    },
    {
      area: "Payment points",
      surfaces: ["POS terminals", "Card machines", "Cash counters"],
    },
    {
      area: "Washrooms",
      surfaces: ["Door handles", "Taps", "Flush buttons", "Counters"],
    },
    {
      area: "Banquet halls and circulation",
      surfaces: ["Banquet hall door handles", "Lift buttons", "Handrails", "Stage and podium rails"],
    },
  ],
  approach: [
    {
      title: "Assess.",
      body: "We study your space, surfaces and service flow, and identify the touchpoints that matter most.",
    },
    {
      title: "Protect.",
      body: "After cleaning, when the space is empty, trained technicians apply ProteGo by ULV to hard, non-food-contact surfaces.",
    },
    {
      title: "Verify.",
      body: "ATP testing measures surface cleanliness in Relative Light Units (RLU), so you have objective data, not guesswork.",
    },
    {
      title: "Report and renew.",
      body: "You receive a digital report with results and recommendations, and we renew protection every 30 days.",
    },
  ],
  benefits: [
    {
      who: "Guests",
      body: "Cleaner, protected surfaces across the whole guest journey, from arrival to exit.",
    },
    {
      who: "Your team",
      body: "Protection that works between cleans and complements, not replaces, your existing routines.",
    },
    {
      who: "Owners and managers",
      body: "Documented ATP results that support inspections and internal reviews.",
    },
    {
      who: "Multi-outlet operators",
      body: "One measurable standard you can compare across locations.",
    },
  ],
  line: "Protect once. Clean as usual. Measurable every time.",
  faqs: [
    {
      q: "Is ProteGo used on food or food-contact surfaces?",
      a: "No. It is designed for hard, non-food-contact surfaces only. It is never applied to food, ingredients, utensils, cookware or any surface that touches food.",
    },
    {
      q: "When do you apply it?",
      a: "After cleaning, when the space is empty, planned around your service hours. Treated surfaces are ready once dry, in about an hour.",
    },
    {
      q: "Do we still need to clean and sanitise?",
      a: "Yes. ProteGo complements, not replaces, your cleaning and food safety practices. It keeps working on treated surfaces between cleans.",
    },
    {
      q: "Can we start small?",
      a: "Yes. We can run a pilot in selected areas, verify with ATP testing and share a report before you decide on a wider programme.",
    },
  ],
  contactSector: "Hotel, restaurant or café",
  related: ["hotels-and-resorts", "food-service", "multiplexes"],
};
