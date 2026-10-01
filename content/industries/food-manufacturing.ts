import type { Industry } from "./types";

export const industry: Industry = {
  slug: "food-manufacturing",
  name: "Food manufacturing",
  group: "Manufacturing",
  covers: "Food processing and manufacturing facilities",
  summary:
    "Long-lasting protection for the non-food-contact surfaces your teams touch all day, outside the product zone.",
  image: {
    src: "/images/lab-microscope.jpg",
    alt: "A technician in a hairnet and white coat looking through a microscope",
  },
  headline: "Hygiene beyond the production line.",
  lede: "In food manufacturing, hygiene is part of how you meet your standards every day. ProteGo adds long-lasting protection to the high-touch, non-food-contact surfaces around your production areas.",
  challenge: {
    title: "Clean at the start of a shift. Touched all day after.",
    intro:
      "Your cleaning and sanitation schedules are built for the production floor. Around it, people move through shared spaces and touch the same surfaces over and over.",
    points: [
      {
        title: "Constant movement",
        body: "Staff, contractors, drivers and visitors pass through entrances, change rooms, corridors and dispatch areas throughout every shift.",
      },
      {
        title: "Recontamination between cleans",
        body: "Once a surface has been cleaned and has dried, the next touch can bring microbes straight back.",
      },
      {
        title: "Scrutiny that never stops",
        body: "Audits and customer inspections look for consistent, documented hygiene across the whole site, not just on the line.",
      },
      {
        title: "Little room for downtime",
        body: "Any extra hygiene step has to fit around production schedules, shift changes and planned shutdowns.",
      },
    ],
  },
  zones: [
    {
      area: "Entrances and hygiene stations",
      surfaces: [
        "Door handles and push plates",
        "Access control panels",
        "Biometric and attendance devices",
        "Hand-wash station taps",
      ],
    },
    {
      area: "Change rooms and corridors",
      surfaces: [
        "Locker handles",
        "Benches",
        "Light switches",
        "Handrails and stair rails",
      ],
    },
    {
      area: "Warehouse and dispatch",
      surfaces: [
        "Trolley and pallet truck handles",
        "Loading bay door handles",
        "Dispatch desks",
        "Shared scanners and keyboards",
      ],
    },
    {
      area: "Offices and meeting rooms",
      surfaces: [
        "Reception desks",
        "Meeting room tables",
        "Chair armrests",
        "Shared printers and phones",
      ],
    },
    {
      area: "Staff amenities and washrooms",
      surfaces: [
        "Vending machine buttons",
        "Water dispenser buttons",
        "Washroom taps and flush plates",
        "Washroom door handles",
      ],
    },
  ],
  approach: [
    {
      title: "Agree the scope with your team",
      body: "We walk the site with your food safety team and agree which hard, non-food-contact, high-touch surfaces are in scope. Product-contact surfaces stay with your existing procedures.",
    },
    {
      title: "Measure a baseline",
      body: "Representative surfaces are swabbed with ATP testing before treatment, so you start from a measured reading in Relative Light Units (RLU).",
    },
    {
      title: "Apply between production runs",
      body: "Trained technicians apply ProteGo with ULV equipment after cleaning, when the area is empty. Surfaces need about 1 hour to dry.",
    },
    {
      title: "Verify, report and renew",
      body: "ATP readings are repeated after application and recorded in a digital report. Protection lasts up to 30 days on treated surfaces under normal conditions, so we renew monthly.",
    },
  ],
  benefits: [
    {
      who: "Food safety and quality teams",
      body: "Before-and-after ATP readings and digital reports add a documented layer to the hygiene records you already keep.",
    },
    {
      who: "Plant and operations heads",
      body: "One scheduled application a month, planned around your production, with no change to your cleaning programme.",
    },
    {
      who: "Your people",
      body: "Cleaner shared touchpoints in the places they use every shift, from the entrance to the canteen.",
    },
  ],
  line: "Taking hygiene from reactive to reliable.",
  faqs: [
    {
      q: "Can ProteGo be used on processing lines or conveyor belts?",
      a: "No. ProteGo is for hard, non-food-contact surfaces only. It is not for food, ingredients, utensils or any surface that comes into direct contact with food or product.",
    },
    {
      q: "Does it replace our cleaning and sanitation schedule?",
      a: "No. ProteGo complements, not replaces, your cleaning, sanitation and food safety procedures. It works on treated surfaces between cleans.",
    },
    {
      q: "How do you show it is working?",
      a: "We take ATP readings before and after application and share them in a digital report. ATP measures organic residue on a surface, shown in Relative Light Units (RLU), not a microbe count.",
    },
  ],
  contactSector: "Manufacturing or pharma",
  related: ["pharmaceutical", "food-service", "offices"],
};
