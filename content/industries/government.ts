import type { Industry } from "./types";

export const industry: Industry = {
  slug: "government",
  name: "Government and municipal",
  group: "Travel and public spaces",
  covers: "Municipal corporations, urban local bodies and public facilities",
  summary:
    "Measured, evidence-led surface protection for civic offices, municipal schools, health centres and public washrooms.",
  image: {
    src: "/images/industries/government.jpg",
    alt: "A bright, orderly civic service hall with a waiting area and service counters",
  },
  headline: "Every public space matters.",
  lede: "Municipal facilities serve citizens every day, and their shared surfaces see constant contact. ProteGo adds up to 30 days of protection on treated surfaces, measured one facility at a time.",
  challenge: {
    title: "Shared spaces, continuous contact.",
    intro:
      "From ward offices to public washrooms, cleaning teams keep municipal facilities in order. But a cleaned surface is open to the next touch once it dries.",
    points: [
      {
        title: "Many facility types",
        body: "Hospitals, schools, civic offices, service centres and washrooms each have different routines and constraints.",
      },
      {
        title: "Decisions need evidence",
        body: "Public bodies need clear, documented results before extending any new approach across wards and zones.",
      },
      {
        title: "Areas must stay in service",
        body: "Treatment has to fit scheduled maintenance windows, since treated areas need about an hour before reopening.",
      },
    ],
  },
  zones: [
    {
      area: "Civic offices and ward offices",
      surfaces: [
        "Service counters",
        "Door handles",
        "Lift buttons",
        "Stair handrails",
      ],
    },
    {
      area: "Citizen service centres",
      surfaces: [
        "Token and queue kiosks",
        "Counter tops",
        "Card and payment terminals",
        "Waiting-area seat armrests",
      ],
    },
    {
      area: "Municipal hospitals and health centres",
      surfaces: [
        "Waiting-area seat armrests",
        "Bed rails",
        "Nurse station counters",
        "Lift buttons",
      ],
    },
    {
      area: "Municipal schools",
      surfaces: [
        "Desk tops",
        "Door handles",
        "Stair handrails",
        "Light switches",
      ],
    },
    {
      area: "Public washrooms",
      surfaces: [
        "Door handles and locks",
        "Taps and wash basins",
        "Flush buttons",
        "Grab rails",
      ],
    },
  ],
  approach: [
    {
      title: "Planned around public service",
      body: "Application is scheduled for maintenance windows or temporary access restrictions, since treated areas need about 1 hour before they return to service.",
    },
  ],
  benefits: [
    {
      who: "Municipal authorities",
      body: "Documented results, so decisions on wider use across wards and zones rest on evidence.",
    },
    {
      who: "Facility administrators",
      body: "Readings and reports for each site that you can keep for audit.",
    },
    {
      who: "Citizens",
      body: "Shared surfaces in public facilities that are protected between cleans.",
    },
  ],
  line: "Science that protects. Data that proves it.",
  faqs: [
    {
      q: "Does it suit every type of facility?",
      a: "Hospitals, schools, civic offices, service centres and public washrooms each have different routines, so suitability is assessed for each environment before treatment.",
    },
  ],
  contactSector: "Transport or government",
  related: ["education", "healthcare", "railways"],
};
