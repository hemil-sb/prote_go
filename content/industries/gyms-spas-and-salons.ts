import type { Industry } from "./types";

export const industry: Industry = {
  slug: "gyms-spas-and-salons",
  name: "Gyms, spas and salons",
  group: "Workplaces and retail",
  covers: "Gyms, fitness studios, spas, salons and beauty clinics",
  summary:
    "Long-lasting protection for shared equipment, counters and washrooms in fitness, wellness and beauty spaces.",
  image: {
    src: "/images/industries/gyms.jpg",
    alt: "A calm, naturally lit gym floor with dumbbells resting on a rack",
  },
  headline: "Where wellness meets hygiene.",
  lede: "Your clients notice cleanliness and remember how a space made them feel. ProteGo keeps working on the surfaces they share between your routine cleans, for up to 30 days.",
  challenge: {
    title: "Shared surfaces, all day long.",
    intro:
      "In a gym, spa or salon, the same handles, counters and fittings pass from hand to hand from opening to closing. A wipe-down helps, but most products stop working once they dry.",
    points: [
      {
        title: "Constant hand contact",
        body: "Weights, machine grips, lockers and basins are touched by member after member, often within minutes.",
      },
      {
        title: "The gap between cleans",
        body: "Once a surface dries after cleaning, the next touch can bring microbes straight back.",
      },
      {
        title: "Confidence is part of the service",
        body: "Clients judge a wellness space by how cared for it feels. Visible, consistent hygiene helps them return with confidence.",
      },
      {
        title: "Little time to spare",
        body: "Busy timetables leave short windows for hygiene work, so any treatment has to fit around your hours.",
      },
    ],
  },
  zones: [
    {
      area: "Gym floor",
      surfaces: [
        "Dumbbell and kettlebell handles",
        "Machine grips and adjustment pins",
        "Treadmill and bike consoles",
        "Rack and bench frames",
      ],
    },
    {
      area: "Salon and treatment rooms",
      surfaces: [
        "Chair levers and footrests",
        "Trolley and station tops",
        "Wash basins and taps",
        "Door handles",
      ],
    },
    {
      area: "Changing rooms and washrooms",
      surfaces: [
        "Locker handles and keypads",
        "Taps and wash basins",
        "Shower controls",
        "Door handles and locks",
      ],
    },
    {
      area: "Reception",
      surfaces: [
        "Reception counters",
        "Card and payment terminals",
        "Check-in screens",
        "Entrance door handles",
      ],
    },
  ],
  approach: [
    {
      title: "Professional ULV application",
      body: "For larger gyms, chains and spas, our trained team applies ProteGo Surface Protectant with ULV misting, planned around your opening hours. Surfaces need about 1 hour to dry.",
    },
    {
      title: "An invisible bonded layer",
      body: "Si-QAC technology forms a layer that bonds to hard, high-touch surfaces and disrupts microbes on contact, for up to 30 days under normal conditions.",
    },
    {
      title: "Measured before and after",
      body: "ATP testing records surface cleanliness before and after treatment, and every visit ends with a digital report.",
    },
    {
      title: "A DIY option for smaller studios",
      body: "Boutique salons, yoga studios and small gyms can start with the 500 ml DIY Protection Kit, which covers about 750 sq ft.",
    },
  ],
  benefits: [
    {
      who: "Owners and operators",
      body: "A documented, monthly routine with reports you can show, and a ProteGo Protected Space™ certificate for your reception.",
    },
    {
      who: "Members and clients",
      body: "Equipment and fittings that are protected between cleans, and a visible sign that hygiene is taken seriously.",
    },
    {
      who: "Staff",
      body: "Support for the cleaning they already do, with clear guidance on which surfaces are treated and when renewal is due.",
    },
    {
      who: "Chains and multi-site operators",
      body: "One standard and one style of reporting across every location.",
    },
  ],
  line: "Every surface. Every day.",
  faqs: [
    {
      q: "Do we still need to wipe down equipment?",
      a: "Yes. ProteGo complements, not replaces, routine cleaning. Keep your usual wipe-downs; the protective layer keeps working in between.",
    },
    {
      q: "Can it go on mats, upholstery or towels?",
      a: "ProteGo is for hard, non-food-contact, high-touch surfaces. During the site assessment we agree exactly which surfaces are suitable.",
    },
    {
      q: "Will treatment interrupt our sessions?",
      a: "Application is planned around your timetable. Treated areas need about 1 hour to dry before use.",
    },
    {
      q: "What does the ATP test show?",
      a: "ATP testing measures organic residue on a surface in Relative Light Units (RLU). It is a cleanliness reading, not a microbe count.",
    },
  ],
  contactSector: "Retail, multiplex or gym",
  related: ["hotels-and-resorts", "offices", "retail"],
};
