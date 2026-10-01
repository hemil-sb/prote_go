import type { Industry } from "./types";

export const industry: Industry = {
  slug: "multiplexes",
  name: "Multiplexes",
  group: "Workplaces and retail",
  covers: "Multiplexes, cinemas and entertainment destinations",
  summary:
    "Protection for kiosks, armrests and handrails across the cinema journey, verified with ATP testing.",
  image: {
    src: "/images/industries/multiplexes.jpg",
    alt: "Rows of empty seats in a softly lit cinema auditorium",
  },
  headline: "Every touchpoint shapes the guest experience.",
  lede: "Moviegoers expect a clean, comfortable space that reflects the quality of your brand. ProteGo adds long-lasting protection to the surfaces guests touch most, from ticketing to the final credits.",
  challenge: {
    title: "Focus on what guests touch most.",
    intro:
      "A single visit takes in parking, ticketing, security, concessions, the auditorium and washrooms. Each step involves shared, high-touch surfaces.",
    points: [
      {
        title: "Show after show",
        body: "Auditoria turn over several times a day, with little time between screenings.",
      },
      {
        title: "Shared screens and scanners",
        body: "Ticket kiosks, QR scanners and payment terminals are touched by guest after guest.",
      },
      {
        title: "The gap between cleans",
        body: "Housekeeping between shows matters, but once a surface dries the next touch can recontaminate it.",
      },
    ],
  },
  zones: [
    {
      area: "Lobby and ticketing",
      surfaces: [
        "Ticket kiosks and touch screens",
        "QR and barcode scanners",
        "Box office counters",
        "Door handles and push plates",
      ],
    },
    {
      area: "Circulation",
      surfaces: [
        "Escalator handrails",
        "Lift buttons and panels",
        "Stair rails",
      ],
    },
    {
      area: "Auditoria",
      surfaces: [
        "Seat armrests",
        "Seat backs",
        "Aisle handrails",
        "Auditorium door handles",
      ],
    },
    {
      area: "Concessions",
      surfaces: [
        "Payment terminals",
        "Self-order kiosk screens",
        "Queue rails",
      ],
    },
    {
      area: "Washrooms",
      surfaces: [
        "Taps",
        "Flush plates",
        "Soap and towel dispensers",
        "Door locks and latches",
      ],
    },
    {
      area: "Back of house",
      surfaces: [
        "Staff room door handles",
        "Shared desks",
        "Shared keyboards and phones",
      ],
    },
  ],
  approach: [
    {
      title: "Assess and prepare",
      body: "We map high-touch zones with your team. Surfaces are pre-cleaned before treatment, as part of your normal routine.",
    },
    {
      title: "Professional application",
      body: "Trained technicians apply ProteGo with ULV equipment, planned around show timings. It forms an invisible, bonded Si-QAC layer that disrupts microbes on contact.",
    },
    {
      title: "Verify with ATP testing",
      body: "Readings are taken before application and again during the cycle, then shared in a digital report.",
    },
    {
      title: "Start with a pilot",
      body: "A focused 30-day pilot in one or two auditoria or public zones lets you review the results before any wider rollout.",
    },
  ],
  benefits: [
    {
      who: "Multiplex operators",
      body: "A measurable, documented hygiene standard you can repeat across screens and sites.",
    },
    {
      who: "Guests",
      body: "Cleaner touchpoints at every step of the visit, from the ticket kiosk to the washroom.",
    },
    {
      who: "Frontline and housekeeping teams",
      body: "One scheduled application every 30 days that works alongside their existing cleaning.",
    },
  ],
  line: "Measure. Verify. Then scale.",
  faqs: [
    {
      q: "Will application interrupt our shows?",
      a: "No. Applications are planned around show timings, usually outside operating hours. Surfaces need about 1 hour to dry.",
    },
    {
      q: "Can it go on cup holders or food counters?",
      a: "No. ProteGo is for hard, non-food-contact, high-touch surfaces, so we leave out cup holders, tray tables and food-serving surfaces.",
    },
    {
      q: "Has the product been tested?",
      a: "Yes. Its efficacy has been tested by an NABL-accredited laboratory. On site, we verify each application with before-and-after ATP readings, which measure organic residue in Relative Light Units (RLU).",
    },
  ],
  contactSector: "Retail, multiplex or gym",
  related: ["retail", "restaurants-and-banquets", "gyms-spas-and-salons"],
};
