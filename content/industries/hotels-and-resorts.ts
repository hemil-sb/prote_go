import type { Industry } from "./types";

export const industry: Industry = {
  slug: "hotels-and-resorts",
  name: "Hotels and resorts",
  group: "Hospitality and food",
  covers: "Hotels, resorts and serviced apartments",
  summary: "Protection for the surfaces guests touch from check-in to check-out, alongside your housekeeping.",
  image: {
    src: "/images/industries/hotels.jpg",
    alt: "A bright, calm hotel lobby with a reception desk",
  },
  headline: "Every stay begins with trust.",
  lede: "Guests choose a hotel expecting comfort and peace of mind. ProteGo protects the surfaces they touch between housekeeping rounds, for up to 30 days.",
  challenge: {
    title: "Housekeeping is essential. But is it enough?",
    intro:
      "Routine cleaning is the foundation of every good hotel. Yet high-touch surfaces are used continuously, and the next touch can undo a fresh clean.",
    points: [
      {
        title: "Every guest touches dozens of surfaces.",
        body: "Door handles, reception counters, lift buttons and bathroom fittings are shared by many hands each day.",
      },
      {
        title: "Reputation is built on every experience.",
        body: "A single poor impression can shape reviews, guest confidence and repeat stays.",
      },
      {
        title: "Guests notice the details.",
        body: "Expectations of cleanliness are high, and guests look for care they can see.",
      },
    ],
  },
  zones: [
    {
      area: "Lobby and reception",
      surfaces: ["Reception counters", "Entrance door handles", "Lift buttons", "Handrails"],
    },
    {
      area: "Guest rooms",
      surfaces: ["Door handles", "Light switches", "Wardrobe handles", "Desk surfaces"],
    },
    {
      area: "Bathrooms and public washrooms",
      surfaces: ["Taps", "Flush buttons", "Door handles", "Counters"],
    },
    {
      area: "Restaurants and conference rooms",
      surfaces: ["Dining tabletops", "Chair backs", "Menu folders", "Meeting tables"],
    },
    {
      area: "Gyms and spas",
      surfaces: ["Gym equipment handles", "Benches", "Locker handles", "Reception counters"],
    },
    {
      area: "Back of house",
      surfaces: ["Housekeeping trolley handles", "Staff room tables", "Service lift buttons", "Door handles"],
    },
  ],
  approach: [
    {
      title: "Show guests the standard.",
      body: "Treated spaces can display the ProteGo Protected Space™ certificate, with a QR code guests can scan to verify.",
    },
  ],
  benefits: [
    {
      who: "Guests",
      body: "Greater confidence in the surfaces they touch throughout their stay.",
    },
    {
      who: "General managers",
      body: "ATP data and digital reports that make hygiene measurable across the property.",
    },
    {
      who: "Owners and groups",
      body: "A consistent, documented standard that supports your reputation across every property.",
    },
  ],
  line: "Protecting guest confidence. One surface at a time.",
  faqs: [
    {
      q: "Will treatment disrupt our guests?",
      a: "We plan applications around occupancy and operations. Surfaces are treated after cleaning, and areas are ready again once dry, in about an hour.",
    },
    {
      q: "Can it be used in restaurants and kitchens?",
      a: "Only on hard, non-food-contact surfaces such as door handles, tabletops and menu folders. It is never applied to food, utensils or food-contact surfaces.",
    },
  ],
  contactSector: "Hotel, restaurant or café",
  related: ["restaurants-and-banquets", "gyms-spas-and-salons", "airports"],
};
