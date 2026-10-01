import type { Industry } from "./types";

export const industry: Industry = {
  slug: "pharmaceutical",
  name: "Pharmaceutical",
  group: "Manufacturing",
  covers: "Pharmaceutical manufacturing sites, warehouses and campuses",
  summary:
    "Protection for high-touch, non-product-contact surfaces that complements your validated cleaning programme.",
  image: {
    src: "/images/scientist-microscope.jpg",
    alt: "A scientist working at a microscope",
  },
  headline: "Hygiene doesn't stop at the production floor.",
  lede: "Microbes follow people, movement and touch throughout a facility. ProteGo helps protect the high-touch, non-product-contact surfaces around production, alongside the protocols you have already validated.",
  challenge: {
    title: "The hygiene challenge beyond the manufacturing process.",
    intro:
      "Validated cleaning and disinfection protocols do essential work inside production. Around them, employees, contractors, visitors and materials move through shared spaces all day.",
    points: [
      {
        title: "People on the move",
        body: "Employees, contractors and visitors pass through reception, corridors, warehouses and amenities throughout every shift.",
      },
      {
        title: "Shared touchpoints",
        body: "Many people touch the same door handles, lift buttons, stair rails and access panels each day.",
      },
      {
        title: "Recontamination after cleaning",
        body: "Routine cleaning removes contamination, but high-touch surfaces can begin collecting microorganisms again as soon as they are used.",
      },
      {
        title: "A site-wide GMP culture",
        body: "These areas may not touch the product, yet consistent hygiene across the whole facility supports housekeeping and reinforces GMP culture.",
      },
    ],
  },
  zones: [
    {
      area: "Reception and offices",
      surfaces: [
        "Reception and security desks",
        "Meeting room tables",
        "Training room furniture",
        "Door handles and push plates",
      ],
    },
    {
      area: "Corridors and circulation",
      surfaces: [
        "Lift buttons",
        "Stair rails",
        "Corridor door handles",
        "Light switches",
      ],
    },
    {
      area: "Access points",
      surfaces: [
        "Access control panels",
        "Time attendance devices",
        "Shared touch screens",
      ],
    },
    {
      area: "Warehouse, packaging and dispatch",
      surfaces: [
        "Dispatch desks",
        "Trolley and pallet truck handles",
        "Loading bay door handles",
        "Shared scanners and keyboards",
      ],
    },
    {
      area: "Staff amenities and washrooms",
      surfaces: [
        "Staff change room lockers",
        "Cafeteria chair backs",
        "Washroom taps and flush plates",
        "Washroom door handles",
      ],
    },
  ],
  approach: [
    {
      title: "Assess with your QA team",
      body: "A walkthrough identifies high-touch, non-product-contact surfaces and defines the scope, aligned with your site SOPs and QA approval where applicable.",
    },
    {
      title: "Set an ATP baseline",
      body: "Representative surfaces are tested before treatment to give a measurable starting point in Relative Light Units (RLU).",
    },
    {
      title: "Apply around your schedule",
      body: "Trained technicians apply ProteGo with professional ULV equipment, planned around operations to keep disruption to a minimum.",
    },
    {
      title: "Verify, document, renew",
      body: "ATP readings and application records go into a digital report. Protection lasts up to 30 days on treated surfaces under normal conditions, so the programme repeats monthly.",
    },
  ],
  benefits: [
    {
      who: "Quality Assurance and Validation",
      body: "Clear boundaries: designed for non-product-contact surfaces only, with documented applications and ATP readings to review.",
    },
    {
      who: "Site and facility leadership",
      body: "A practical addition to environmental hygiene across offices, corridors, warehouses and staff facilities.",
    },
    {
      who: "Operations",
      body: "Scheduled applications that fit around production, starting with a pilot at one facility before any wider rollout.",
    },
  ],
  line: "Evaluate. Verify. Decide.",
  faqs: [
    {
      q: "Can ProteGo be used on product-contact surfaces or in sterile areas?",
      a: "No. It is not intended for direct product-contact surfaces, validated manufacturing equipment or sterile manufacturing environments. Those stay with your validated cleaning and disinfection procedures.",
    },
    {
      q: "What about areas close to production?",
      a: "Equipment exteriors, QC laboratory support areas, material transfer corridors and similar spaces should be reviewed under your site's quality and change-control procedures first. When in doubt, consult your QA and Validation teams.",
    },
    {
      q: "Does it replace our validated cleaning?",
      a: "No. ProteGo complements, not replaces, your validated cleaning and disinfection programme. It adds protection to appropriate surfaces between scheduled applications.",
    },
    {
      q: "How do we evaluate it?",
      a: "Start with a pilot in agreed areas. We take ATP readings before and after application, share a digital report and review the findings with your team before you decide on next steps.",
    },
  ],
  contactSector: "Manufacturing or pharma",
  related: ["food-manufacturing", "healthcare", "offices"],
};
