import type { Industry } from "./types";

export const industry: Industry = {
  slug: "healthcare",
  name: "Healthcare",
  group: "Healthcare",
  covers: "Hospitals, clinics and diagnostic labs",
  summary: "Up to 30 days of protection on the high-touch surfaces patients, visitors and staff share.",
  image: {
    src: "/images/clinician-scrubs.jpg",
    alt: "A smiling healthcare worker in turquoise scrubs",
  },
  headline: "Care begins with the surfaces everyone touches.",
  lede: "Hospitals and clinics are cleaned all day, yet a surface can be touched again moments later. ProteGo adds a bonded protective layer that keeps working between cleans, for up to 30 days.",
  challenge: {
    title: "In healthcare, hygiene is a commitment.",
    intro:
      "Healthcare spaces welcome vulnerable people every day. Your cleaning teams work hard, but busy shared surfaces are touched again almost as soon as they are wiped.",
    points: [
      {
        title: "Many hands, the same surfaces.",
        body: "Patients, visitors and staff pass the same door handles, lift buttons and counters all day.",
      },
      {
        title: "Disinfectants stop when they dry.",
        body: "Routine disinfection matters, but once a surface dries the next touch can recontaminate it.",
      },
      {
        title: "Rounds are frequent and demanding.",
        body: "Teams repeat the same high-touch surfaces many times a day, across wards, OPDs and public areas.",
      },
      {
        title: "Records need to be clear.",
        body: "Quality and facilities teams need hygiene data they can file, compare and share.",
      },
    ],
  },
  zones: [
    {
      area: "Reception and waiting areas",
      surfaces: ["Reception counters", "Door handles and push plates", "Armrests on waiting seats", "Queue and token kiosks"],
    },
    {
      area: "OPDs and corridors",
      surfaces: ["Consultation room door handles", "Handrails", "Light switches", "Registration desks"],
    },
    {
      area: "Wards and nurse stations",
      surfaces: ["Nurse station counters", "Ward door handles", "Light switches", "Visitor chairs"],
    },
    {
      area: "Lifts and stairways",
      surfaces: ["Lift buttons", "Lift handrails", "Stair banisters"],
    },
    {
      area: "Washrooms",
      surfaces: ["Door handles", "Taps", "Flush buttons", "Counters"],
    },
    {
      area: "Cafeterias and shared spaces",
      surfaces: ["Tabletops", "Chair backs", "Payment counters", "Door handles"],
    },
  ],
  approach: [
    {
      title: "Assess and measure.",
      body: "We walk your facility with your team, map the high-touch surfaces and take ATP readings to set a baseline.",
    },
    {
      title: "Apply around your schedule.",
      body: "Trained technicians apply ProteGo by ULV to clean, dry, hard surfaces during planned maintenance windows. Areas are ready again in about an hour.",
    },
    {
      title: "Verify and report.",
      body: "We repeat ATP tests after application and share a digital report. ATP measures organic residue in Relative Light Units (RLU), not a microbe count.",
    },
    {
      title: "Care that continues at home.",
      body: "For patients going home after discharge, our Hospital to Home™ programme brings the same protection to the home.",
    },
  ],
  benefits: [
    {
      who: "Patients and visitors",
      body: "Shared surfaces in waiting areas, corridors and washrooms are protected between cleans.",
    },
    {
      who: "Clinical and nursing staff",
      body: "Protection on the counters, handles and switches they reach for many times a shift.",
    },
    {
      who: "Housekeeping teams",
      body: "A bonded layer that complements, not replaces, your existing cleaning and infection-prevention protocols.",
    },
    {
      who: "Quality and facilities leads",
      body: "Before-and-after ATP readings in a digital report, ready to file with your hygiene records.",
    },
  ],
  line: "Protective care begins with protecting every surface.",
  faqs: [
    {
      q: "Does ProteGo replace our infection-prevention protocols?",
      a: "No. It complements, not replaces, routine cleaning, hand hygiene and your existing protocols. It protects treated surfaces between cleans.",
    },
    {
      q: "Which areas do you treat?",
      a: "Hard, high-touch surfaces in public and shared areas such as reception, OPDs, corridors, lifts, washrooms and cafeterias. We agree the exact scope with your team during the site assessment.",
    },
    {
      q: "How much disruption is there?",
      a: "We apply during planned maintenance windows. Treated areas need about an hour to dry before they return to service.",
    },
    {
      q: "What does an ATP reading tell us?",
      a: "ATP testing measures organic residue on a surface in Relative Light Units (RLU). Lower readings mean a cleaner surface. It is not a count of microbes.",
    },
  ],
  contactSector: "Hospital or clinic",
  related: ["pharmaceutical", "education", "residential"],
};
