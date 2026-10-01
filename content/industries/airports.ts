import type { Industry } from "./types";

export const industry: Industry = {
  slug: "airports",
  name: "Airports and travel",
  group: "Travel and public spaces",
  covers: "Airport terminals, lounges and travel operators",
  summary:
    "Protection for the counters, trays, handrails and kiosks that passengers touch on every journey.",
  image: {
    src: "/images/travel-escalator.jpg",
    alt: "Travellers riding an escalator, hands on the handrail, beneath a bilingual toilets sign",
  },
  headline: "Protecting the surfaces passengers touch.",
  lede: "Terminals run around the clock, and the same surfaces are touched by passenger after passenger. ProteGo works alongside your cleaning programme with up to 30 days of protection on treated surfaces.",
  challenge: {
    title: "Every touchpoint, every terminal.",
    intro:
      "Airports never really close. Cleaning teams work hard, but a surface that has just been cleaned is open to the next touch as soon as it dries.",
    points: [
      {
        title: "Shared by thousands",
        body: "Security trays, gate seating and kiosk screens pass from hand to hand throughout the day.",
      },
      {
        title: "Continuous contact",
        body: "Handrails, lift buttons and trolley handles are touched along the whole passenger journey.",
      },
      {
        title: "Tight maintenance windows",
        body: "In a 24/7 operation, any treatment has to fit planned maintenance windows without slowing passengers down.",
      },
      {
        title: "Confidence starts at the kerb",
        body: "Passengers form a view of the whole journey from the first surfaces they touch.",
      },
    ],
  },
  zones: [
    {
      area: "Check-in",
      surfaces: [
        "Check-in counters",
        "Self check-in kiosks",
        "Queue barrier posts",
        "Baggage trolley handles",
      ],
    },
    {
      area: "Security screening",
      surfaces: [
        "Screening trays",
        "Divesting tables",
        "Rail and roller edges",
      ],
    },
    {
      area: "Gates and concourses",
      surfaces: [
        "Gate seating armrests",
        "Escalator and travelator handrails",
        "Lift buttons",
        "Information kiosks",
      ],
    },
    {
      area: "Lounges",
      surfaces: [
        "Reception counters",
        "Door handles",
        "Charging points",
        "Seat armrests",
      ],
    },
    {
      area: "Washrooms",
      surfaces: [
        "Door handles and locks",
        "Taps and wash basins",
        "Flush buttons",
        "Hand dryers",
      ],
    },
  ],
  approach: [
    {
      title: "Map the high-touch surfaces",
      body: "We start with a site assessment and map the surfaces passengers touch most, zone by zone.",
    },
    {
      title: "Apply during maintenance windows",
      body: "Trained technicians apply ProteGo Surface Protectant with ULV equipment during planned windows. Treated surfaces need about 1 hour to dry.",
    },
    {
      title: "A bonded, invisible layer",
      body: "Si-QAC technology forms a layer that bonds to hard, non-food-contact surfaces and disrupts microbes on contact, for up to 30 days under normal conditions.",
    },
    {
      title: "Verify and report",
      body: "Before-and-after ATP testing and a digital report show how surface cleanliness changes over the cycle.",
    },
  ],
  benefits: [
    {
      who: "Terminal operations",
      body: "A monthly protection routine that fits planned maintenance, with data to review at the end of each cycle.",
    },
    {
      who: "Housekeeping teams",
      body: "Support for existing cleaning schedules, not another task added to them.",
    },
    {
      who: "Passengers",
      body: "Shared surfaces that are protected between cleans, from check-in to the gate.",
    },
    {
      who: "Lounge and travel operators",
      body: "A calm, visible commitment to hygiene in the spaces your guests choose to spend time in.",
    },
  ],
  line: "Every touchpoint. Every terminal. Every day.",
  faqs: [
    {
      q: "Does ProteGo replace our cleaning contract?",
      a: "No. ProteGo complements, not replaces, routine cleaning. Your teams keep their schedules; the protective layer works between cleans.",
    },
    {
      q: "Can we start small?",
      a: "Yes. Start with one terminal or zone, measure the results with ATP testing, then decide whether to extend.",
    },
    {
      q: "Is it suitable for seat fabric or carpets?",
      a: "ProteGo is for hard, non-food-contact, high-touch surfaces. Suitability, including in washrooms, is confirmed during the site assessment.",
    },
    {
      q: "How is it tested?",
      a: "Efficacy has been tested by an NABL-accredited laboratory. On site, we use ATP testing, which measures organic residue in Relative Light Units (RLU) rather than counting microbes.",
    },
  ],
  contactSector: "Transport or government",
  related: ["railways", "government", "retail"],
};
