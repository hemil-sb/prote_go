import type { Industry } from "./types";

export const industry: Industry = {
  slug: "railways",
  name: "Railways",
  group: "Travel and public spaces",
  covers: "Stations, trains, coach depots and railway offices",
  summary:
    "Protection between scheduled cleans for station and on-board washrooms, handrails and other shared surfaces.",
  image: {
    src: "/images/industries/railways.jpg",
    alt: "A railway platform in soft daylight with a train waiting at the station",
  },
  headline: "Protection between scheduled cleans.",
  lede: "Station and on-board washrooms are among the most used spaces on any railway. ProteGo complements your existing cleaning with up to 30 days of protection on suitable high-touch surfaces.",
  challenge: {
    title: "Busy spaces, short cleaning windows.",
    intro:
      "Routine cleaning removes visible dirt, but a surface is open to the next touch as soon as it dries. On a busy platform or coach, that next touch comes quickly.",
    points: [
      {
        title: "Hands on the same surfaces",
        body: "Grab rails, door handles, taps and flush buttons are touched by almost everyone who passes through.",
      },
      {
        title: "Limited time on board",
        body: "Coaches turn around quickly, so hygiene work has to fit the time a train spends at the depot or terminal.",
      },
      {
        title: "Proof for many sites",
        body: "Station and depot managers need consistent evidence they can compare from one location to the next.",
      },
    ],
  },
  zones: [
    {
      area: "Station washrooms",
      surfaces: [
        "Taps and wash basins",
        "Flush buttons and panels",
        "Door handles and locks",
        "Cubicle partitions",
        "Grab rails",
      ],
    },
    {
      area: "On-board washrooms",
      surfaces: [
        "Taps and wash basins",
        "Flush buttons",
        "Door handles and latches",
        "Grab rails",
      ],
    },
    {
      area: "Coach interiors",
      surfaces: [
        "Handrails and grab handles",
        "Door handles and push plates",
        "Seat-back grab handles",
        "Light and fan switches",
      ],
    },
    {
      area: "Concourses and platforms",
      surfaces: [
        "Stair and ramp handrails",
        "Lift buttons",
        "Ticket counters",
        "Enquiry and ticket kiosks",
      ],
    },
    {
      area: "Offices and support areas",
      surfaces: [
        "Door handles",
        "Desk edges",
        "Switchboards",
        "Printer and copier panels",
      ],
    },
  ],
  approach: [
    {
      title: "Proposals for stations, depots and networks",
      body: "Large stations, coach depots and multi-site projects get a custom commercial proposal, scoped with your team.",
    },
  ],
  benefits: [
    {
      who: "Station and depot managers",
      body: "Consistent ATP data and reports for each treated location, comparable from one site to the next.",
    },
    {
      who: "Housekeeping teams",
      body: "Works alongside existing cleaning schedules, helping teams hold a consistent standard between cleans.",
    },
    {
      who: "Passengers",
      body: "Washrooms and handrails that are protected between scheduled cleans.",
    },
  ],
  line: "Every station. Every journey. Every day.",
  faqs: [
    {
      q: "What about smaller offices and support areas?",
      a: "For smaller spaces, the 500 ml DIY Protection Kit covers about 750 sq ft and can be applied by your own team where suitable.",
    },
  ],
  contactSector: "Transport or government",
  related: ["airports", "government"],
};
