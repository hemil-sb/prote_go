import type { Industry } from "./types";

export const industry: Industry = {
  slug: "offices",
  name: "Offices",
  group: "Workplaces and retail",
  covers: "Office towers, technology parks, business campuses and corporate headquarters",
  summary:
    "Up to 30 days of protection for the lift buttons, desks and door handles your tenants share every day.",
  image: {
    src: "/images/office-worker.jpg",
    alt: "A smiling office worker at her desk",
  },
  headline: "Protect the places where business happens.",
  lede: "Every shared surface in a building shapes how people feel about working there. ProteGo adds long-lasting protection to high-touch surfaces, measured before and after with ATP testing.",
  challenge: {
    title: "Out of sight. Not out of mind.",
    intro:
      "Offices and common areas look clean after the morning round. Then hundreds of people arrive, and the same few surfaces are touched again and again.",
    points: [
      {
        title: "High footfall",
        body: "Lobbies, lifts and turnstiles carry a steady flow of tenants, visitors and staff from morning to evening.",
      },
      {
        title: "Shared everything",
        body: "Meeting rooms, hot desks and pantries are used by different people throughout the day.",
      },
      {
        title: "The gap between cleans",
        body: "Cleaning works until a surface dries. After that, the next touch can recontaminate it.",
      },
      {
        title: "Pressure on FM teams",
        body: "Facility teams are asked to show consistent standards across large buildings, often with no simple way to measure them.",
      },
    ],
  },
  zones: [
    {
      area: "Lobby and reception",
      surfaces: [
        "Reception desks",
        "Security gates and turnstiles",
        "Visitor seating",
        "Door handles and push plates",
      ],
    },
    {
      area: "Lifts and circulation",
      surfaces: [
        "Lift buttons",
        "Lift interior handrails",
        "Escalator handrails",
        "Stair rails",
      ],
    },
    {
      area: "Workspaces and meeting rooms",
      surfaces: [
        "Meeting room tables",
        "Chair armrests",
        "Shared desks",
        "Room booking and AV panels",
      ],
    },
    {
      area: "Pantries",
      surfaces: [
        "Appliance handles",
        "Coffee machine buttons",
        "Water dispenser buttons",
        "Cabinet handles",
      ],
    },
    {
      area: "Washrooms",
      surfaces: [
        "Taps",
        "Flush plates",
        "Soap and towel dispensers",
        "Cubicle locks and door handles",
      ],
    },
  ],
  approach: [
    {
      title: "Review and map",
      body: "We study your building, occupancy patterns and movement to map the high-touch surfaces that matter most.",
    },
    {
      title: "Apply with minimal disruption",
      body: "Trained technicians apply ProteGo with ULV equipment, scheduled around your working hours. Surfaces need about 1 hour to dry.",
    },
    {
      title: "A bonded, invisible layer",
      body: "ProteGo's Si-QAC technology bonds to treated surfaces and disrupts microbes on contact, for up to 30 days on treated surfaces under normal conditions.",
    },
    {
      title: "Verify and report",
      body: "ATP testing before and after application, documented in a digital report you can share with tenants and owners.",
    },
  ],
  benefits: [
    {
      who: "Owners and asset managers",
      body: "A visible, documented hygiene standard that reflects how you look after your building.",
    },
    {
      who: "Facility management teams",
      body: "A monthly programme that works alongside existing housekeeping, with ATP readings to show the results.",
    },
    {
      who: "Tenants, visitors and staff",
      body: "Cleaner shared touchpoints in the lobbies, lifts and meeting rooms they use every day.",
    },
  ],
  line: "Protect better. Operate smarter.",
  faqs: [
    {
      q: "Does ProteGo replace our housekeeping?",
      a: "No. It complements, not replaces, routine cleaning. Your teams clean as usual, and the treated surfaces keep working between cleans.",
    },
    {
      q: "Will it disrupt tenants?",
      a: "Applications are scheduled around your building's hours, usually when areas are quiet. ProteGo is about 98% water, non-flammable, and needs about 1 hour to dry.",
    },
    {
      q: "Can we start with part of the building?",
      a: "Yes. Most buildings begin with a pilot in a defined area, such as the lobby and lifts, review the ATP results, then decide whether to extend.",
    },
  ],
  contactSector: "Office or business park",
  related: ["retail", "hotels-and-resorts", "residential"],
};
