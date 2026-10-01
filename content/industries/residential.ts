import type { Industry } from "./types";

export const industry: Industry = {
  slug: "residential",
  name: "Residential",
  group: "Homes",
  covers: "Housing societies, apartment buildings and private homes",
  summary:
    "Surface protection for shared lobbies, lifts and amenities, and a simple DIY option for your own home.",
  image: {
    src: "/images/hand-bottle-counter.jpg",
    alt: "A hand placing a pale teal spray bottle on a marble bathroom counter beside folded white towels and a plant",
  },
  headline: "Peace of mind in your most personal spaces.",
  lede: "At home, hygiene is personal. ProteGo protects the surfaces residents share, and the ones you touch at home, for up to 30 days between your usual cleans.",
  challenge: {
    title: "Shared by neighbours, touched every day.",
    intro:
      "In a residential building, the same lift buttons, door handles and railings are used by every household. Housekeeping keeps them clean, but a cleaned surface is open to the next touch once it dries.",
    points: [
      {
        title: "Common areas see constant use",
        body: "Lobbies, lifts and stairwells are touched by residents, visitors and delivery staff from morning to night.",
      },
      {
        title: "Amenities are shared",
        body: "Clubhouse gyms, play areas and common washrooms pass from family to family through the day.",
      },
      {
        title: "Homes have their own routines",
        body: "Inside the home, door handles, switches and bathroom fittings are touched many times a day by everyone in the family.",
      },
    ],
  },
  zones: [
    {
      area: "Lobby and entrance",
      surfaces: [
        "Entrance door handles",
        "Intercom and access panels",
        "Security desk counters",
        "Letterbox handles",
      ],
    },
    {
      area: "Lifts and stairwells",
      surfaces: [
        "Lift call buttons",
        "Lift car panels and handrails",
        "Stair handrails",
        "Fire door push bars",
      ],
    },
    {
      area: "Clubhouse and amenities",
      surfaces: [
        "Gym equipment handles",
        "Door handles and pulls",
        "Light switches",
        "Pool and play-area railings",
      ],
    },
    {
      area: "Common washrooms",
      surfaces: [
        "Taps and wash basins",
        "Flush buttons",
        "Door handles and locks",
      ],
    },
    {
      area: "Inside the home",
      surfaces: [
        "Door handles",
        "Light switches",
        "Bathroom taps and fittings",
        "Wardrobe and cabinet handles",
        "Balcony and stair railings",
      ],
    },
  ],
  approach: [
    {
      title: "Managed protection for societies",
      body: "For housing societies and apartment buildings, our trained team applies ProteGo Surface Protectant to common areas with ULV equipment, then verifies with before-and-after ATP testing and a digital report.",
    },
    {
      title: "The DIY Protection Kit for homes",
      body: "A ready-to-use 500 ml spray that covers about 750 sq ft. Apply it to clean, dry, hard surfaces and allow about 1 hour to dry.",
    },
    {
      title: "Hospital to Home™",
      body: "For families bringing someone home from hospital, our Hospital to Home™ programme supports a cleaner recovery environment on treated surfaces.",
    },
    {
      title: "An invisible bonded layer",
      body: "Si-QAC technology forms a layer that bonds to the surface and disrupts microbes on contact, for up to 30 days under normal conditions.",
    },
  ],
  benefits: [
    {
      who: "Residents' associations and managing committees",
      body: "A clear monthly routine for common areas, with reports you can share with members.",
    },
    {
      who: "Property and facility managers",
      body: "Works alongside your housekeeping contract, with ATP data to show how surface cleanliness changes over each cycle.",
    },
    {
      who: "Households",
      body: "A simple way to protect the hard surfaces your family touches most, at your own pace.",
    },
  ],
  line: "Protection for the space you call home.",
  faqs: [
    {
      q: "Do we still need to clean as usual?",
      a: "Yes. ProteGo complements, not replaces, routine cleaning. Keep your usual routine; the protective layer keeps working in between.",
    },
    {
      q: "Which surfaces can I treat at home?",
      a: "Hard, non-food-contact, high-touch surfaces such as door handles, switches and bathroom fittings. Do not use it on food-contact surfaces, utensils or kitchen worktops where food is prepared.",
    },
    {
      q: "How long does the DIY kit last?",
      a: "One 500 ml bottle covers about 750 sq ft per application, and each application protects treated surfaces for up to 30 days under normal conditions.",
    },
    {
      q: "Someone in our family is coming home from hospital. Can you help?",
      a: "Our Hospital to Home™ programme is designed for this. Get in touch and we will explain how it works and whether it suits your home.",
    },
  ],
  contactSector: "Home or residential",
  related: ["healthcare", "offices", "gyms-spas-and-salons"],
};
