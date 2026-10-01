import type { Industry } from "./types";

export const industry: Industry = {
  slug: "offices",
  name: "Offices",
  group: "Workplaces and retail",
  covers: "Office towers, technology parks, business campuses and corporate headquarters",
  summary:
    "Protection for the lift buttons, desks and door handles your tenants share every day.",
  image: {
    src: "/images/office-worker.jpg",
    alt: "A smiling office worker at her desk",
  },
  headline: "Protect the places where business happens.",
  lede: "Every shared surface in a building shapes how people feel about working there. ProteGo adds up to 30 days of protection per application to high-touch surfaces, measured before and after with ATP testing.",
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
      q: "Will it disrupt tenants?",
      a: "Applications are scheduled around your building's hours, usually when areas are quiet. ProteGo is about 98% water, non-flammable, and needs about 1 hour to dry.",
    },
  ],
  contactSector: "Office or business park",
  related: ["retail", "hotels-and-resorts", "residential"],
};
