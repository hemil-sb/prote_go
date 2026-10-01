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
        title: "Heavy, continuous use",
        body: "Washrooms at stations and on trains are used by a steady stream of passengers between every scheduled clean.",
      },
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
      title: "Assess and select surfaces",
      body: "We assess the site with your team and agree which hard, non-food-contact, high-touch surfaces are suitable for treatment.",
    },
    {
      title: "Professional ULV application",
      body: "Trained technicians apply ProteGo Surface Protectant with calibrated ULV equipment. Treated surfaces need about 1 hour to dry.",
    },
    {
      title: "An invisible bonded layer",
      body: "Si-QAC technology forms a layer that bonds to the surface and disrupts microbes on contact, for up to 30 days under normal conditions.",
    },
    {
      title: "ATP baseline, verification and review",
      body: "ATP readings before and after treatment, a digital report and a review near the end of the cycle give you evidence to decide on wider use.",
    },
  ],
  benefits: [
    {
      who: "Station and depot managers",
      body: "A structured routine with ATP data and digital reports for each treated location.",
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
      q: "Can we start with a single station?",
      a: "Yes. A pilot covers site assessment, application, ATP baseline and verification, a digital report and a performance review, so you can evaluate before going further.",
    },
    {
      q: "Does it replace scheduled cleaning?",
      a: "No. ProteGo complements, not replaces, routine cleaning. It works on treated surfaces between your scheduled cleaning cycles.",
    },
    {
      q: "Which surfaces is it for?",
      a: "Hard, non-food-contact, high-touch surfaces only. It is not for surfaces in direct contact with food.",
    },
    {
      q: "What about smaller offices and support areas?",
      a: "For smaller spaces, the 500 ml DIY Protection Kit covers about 750 sq ft and can be applied by your own team where suitable.",
    },
  ],
  contactSector: "Transport or government",
  related: ["airports", "government"],
};
