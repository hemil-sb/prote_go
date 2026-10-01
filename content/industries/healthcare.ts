import type { Industry } from "./types";

export const industry: Industry = {
  slug: "healthcare",
  name: "Healthcare",
  group: "Healthcare",
  covers: "Hospitals, clinics and diagnostic labs",
  summary: "Protection for the high-touch surfaces patients, visitors and staff share.",
  image: {
    src: "/images/clinician-scrubs.jpg",
    alt: "A smiling healthcare worker in turquoise scrubs",
  },
  headline: "Care begins with the surfaces everyone touches.",
  lede: "Hospitals and clinics are cleaned all day, yet a surface can be touched again moments later. ProteGo adds a bonded protective layer that keeps working between cleans, for up to 30 days.",
  challenge: {
    title: "In healthcare, hygiene is a commitment.",
    intro:
      "Healthcare spaces welcome vulnerable people every day, and your cleaning teams work hard to keep pace.",
    points: [
      {
        title: "Many hands, the same surfaces.",
        body: "Patients, visitors and staff pass the same door handles, lift buttons and counters all day.",
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
      who: "Quality and facilities leads",
      body: "Before-and-after ATP readings in a digital report, ready to file with your hygiene records.",
    },
  ],
  line: "Every surface. Every day.",
  faqs: [
    {
      q: "Which areas do you treat?",
      a: "Hard, high-touch surfaces in public and shared areas such as reception, OPDs, corridors, lifts, washrooms and cafeterias. We agree the exact scope with your team during the site assessment.",
    },
    {
      q: "How much disruption is there?",
      a: "We apply during planned maintenance windows. Treated areas need about an hour to dry before they return to service.",
    },
  ],
  contactSector: "Hospital or clinic",
  related: ["pharmaceutical", "education", "residential"],
};
