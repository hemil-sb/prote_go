import type { Industry } from "./types";

export const industry: Industry = {
  slug: "education",
  name: "Education",
  group: "Education",
  covers: "Schools, colleges and campuses",
  summary: "Protection for the desks, doors and rails students touch all day, verified with ATP testing.",
  image: {
    src: "/images/education-classroom.jpg",
    alt: "Students writing at their desks in a classroom",
  },
  headline: "Protection that lasts beyond the bell.",
  lede: "Every school day, hundreds of hands share the same desks, doors and railings. ProteGo adds an invisible bonded layer that keeps working between cleans, for up to 30 days.",
  challenge: {
    title: "Cleaning is essential. It is not the whole answer.",
    intro:
      "Schools already invest in cleaning and housekeeping. But high-touch surfaces are used continuously, and a surface can be recontaminated by the very next touch.",
    points: [
      {
        title: "High-touch surfaces are everywhere.",
        body: "Desks, door handles, switches and railings are used by many hands, many times a day.",
      },
      {
        title: "Children share almost everything.",
        body: "Classrooms, labs, libraries and buses are some of the busiest shared spaces in any community.",
      },
      {
        title: "Disinfectants stop when they dry.",
        body: "Routine cleaning matters, but once a surface dries the next touch can bring germs straight back.",
      },
      {
        title: "Parents want to see the effort.",
        body: "Families and governing bodies increasingly expect hygiene that is visible and measurable.",
      },
    ],
  },
  zones: [
    {
      area: "Classrooms",
      surfaces: ["Desks and chairs", "Door handles and push plates", "Light switches", "Window latches"],
    },
    {
      area: "Labs and libraries",
      surfaces: ["Shared keyboards and devices", "Lab benches", "Library tables", "Shelf edges"],
    },
    {
      area: "Corridors and stairs",
      surfaces: ["Railings and banisters", "Door handles", "Lift buttons", "Lockers"],
    },
    {
      area: "Washrooms",
      surfaces: ["Taps", "Flush handles", "Doors", "Counters"],
    },
    {
      area: "Dining halls and staff rooms",
      surfaces: ["Tabletops", "Chair backs", "Door handles", "Light switches"],
    },
    {
      area: "Sports facilities and school buses",
      surfaces: ["Sports equipment", "Gym benches", "Bus handrails", "Grab handles"],
    },
  ],
  approach: [
    {
      title: "Consult and assess.",
      body: "We learn your priorities, walk your campus, map the high-touch surfaces and take ATP readings to set a baseline.",
    },
    {
      title: "Apply after hours.",
      body: "Trained technicians apply ProteGo by ULV to clean, hard surfaces when the space is empty. It dries in about an hour.",
    },
    {
      title: "Pilot and verify.",
      body: "Start with an area of your choice. We re-test with ATP at 28 days and share a digital report before you decide to scale.",
    },
    {
      title: "Two ways to protect.",
      body: "A managed programme for whole campuses, or the DIY Protection Kit for smaller spaces and top-ups between visits.",
    },
  ],
  benefits: [
    {
      who: "Students",
      body: "Cleaner treated surfaces in the classrooms, labs and corridors they use every day.",
    },
    {
      who: "Teachers and staff",
      body: "Confidence that shared surfaces are protected between cleans, so they can focus on teaching.",
    },
    {
      who: "Parents",
      body: "A visible, measurable commitment to hygiene that the school can show and explain.",
    },
    {
      who: "Leadership and facility heads",
      body: "A programme that complements housekeeping, with ATP data and digital reports for your records.",
    },
  ],
  proof: {
    quote: "Remarkable and measurable improvements… sustained for a period exceeding one month.",
    source: "Head of Facilities, Dhirubhai Ambani International School, Mumbai",
  },
  line: "Protecting learning. One surface at a time.",
  faqs: [
    {
      q: "Does this replace our housekeeping?",
      a: "No. ProteGo complements, not replaces, routine cleaning, hand hygiene and your school's protocols. It protects treated surfaces between cleans.",
    },
    {
      q: "When do you apply it?",
      a: "After cleaning, when the space is empty, such as evenings, weekends or holidays. Treated areas are ready to use once dry, in about an hour.",
    },
    {
      q: "Can we try it before committing?",
      a: "Yes. We can pilot ProteGo in a defined area, re-test with ATP at 28 days and review the results with you before any wider rollout.",
    },
  ],
  contactSector: "School or college",
  related: ["healthcare", "offices", "gyms-spas-and-salons"],
};
