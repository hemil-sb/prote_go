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
  lede: "Municipal facilities serve citizens every day, and their shared surfaces see constant contact. ProteGo helps you evaluate a measurable approach to surface hygiene, one facility at a time.",
  challenge: {
    title: "Shared spaces, continuous contact.",
    intro:
      "From ward offices to public washrooms, municipal facilities are used by many people in a day. Cleaning teams keep them in order, but a cleaned surface is open to the next touch once it dries.",
    points: [
      {
        title: "Many facility types",
        body: "Hospitals, schools, civic offices, service centres and washrooms each have different routines and constraints.",
      },
      {
        title: "Constant footfall",
        body: "Counters, door handles and lift buttons are touched by citizen after citizen throughout the working day.",
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
      title: "Baseline first",
      body: "ATP swab tests on key high-touch surfaces establish a starting reading before any treatment.",
    },
    {
      title: "Professional ULV application",
      body: "ProteGo Surface Protectant is applied to clean, dry, hard surfaces with ULV equipment. Treated areas need about 1 hour to dry.",
    },
    {
      title: "An invisible bonded layer",
      body: "Si-QAC technology forms a layer that bonds to the surface and disrupts microbes on contact, for up to 30 days under normal conditions.",
    },
    {
      title: "Verify, follow up and report",
      body: "ATP readings straight after treatment and again near the end of the cycle are shared in a digital report you can keep for audit.",
    },
  ],
  benefits: [
    {
      who: "Municipal authorities",
      body: "A pilot with documented results, so decisions on wider use rest on evidence.",
    },
    {
      who: "Facility administrators",
      body: "A monthly routine that fits maintenance windows, with readings and reports for each site.",
    },
    {
      who: "Sanitation and housekeeping teams",
      body: "Support for the cleaning they already do. ProteGo is not a substitute for regular cleaning.",
    },
    {
      who: "Citizens",
      body: "Shared surfaces in public facilities that are protected between cleans.",
    },
  ],
  line: "Science that protects. Data that proves it.",
  faqs: [
    {
      q: "How would a pilot work?",
      a: "Start with one facility: a site assessment, professional application, ATP verification and a performance review near the end of the 30-day cycle.",
    },
    {
      q: "Is it independently tested?",
      a: "Efficacy has been tested by an NABL-accredited laboratory. ProteGo is about 98% water, non-leaching and non-flammable.",
    },
    {
      q: "What do the ATP readings measure?",
      a: "ATP testing measures organic residue on a surface in Relative Light Units (RLU). It shows surface cleanliness; it is not a microbe count.",
    },
    {
      q: "Does it replace our cleaning and sanitation work?",
      a: "No. ProteGo complements, not replaces, routine cleaning and sanitation.",
    },
  ],
  contactSector: "Transport or government",
  related: ["education", "healthcare", "railways"],
};
