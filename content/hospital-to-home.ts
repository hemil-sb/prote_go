// Hospital to Home™ page content.
// Sources: docs/knowledge-base/05-hospital-to-home/ (the 40-slide deck, the latest brief's
// hedged lines and the July 2026 publication's tone). Claims kept to the safe set in
// claims-register.md: no outcome, readmission, "hospital-grade" or safety-for-all claims.

export type HospitalToHomeContent = {
  headline: string;
  lede: string;
  why: { title: string; intro: string; points: { title: string; body: string }[] };
  whoFor: string[];
  touchpoints: { area: string; surfaces: string[] }[];
  steps: { title: string; body: string }[];
  partners: { title: string; body: string };
  privacy: string;
  faqs: { q: string; a: string }[];
  line: string;
};

export const H2H: HospitalToHomeContent = {
  headline: "Recovery continues at home.",
  lede: "Hospital to Home™ is a structured surface-protection programme for people coming home after hospital treatment. We treat the high-touch surfaces in the home, test them before and after, and leave the family with a clear report.",

  why: {
    title: "Why the home deserves attention.",
    intro:
      "Discharge is an important milestone, but recovery carries on in a different place. Hospital to Home™ looks at one part of that place, the surfaces, and treats it with care.",
    points: [
      {
        title: "Recovery changes address.",
        body: "Medicines, rest, meals and follow-up visits all continue at home. The home becomes the place where recovery happens.",
      },
      {
        title: "Homes are not hospitals.",
        body: "Nor should they be. They are places of comfort and familiarity, without a hospital's routines for looking after surfaces.",
      },
      {
        title: "Every touch is part of the day.",
        body: "Door handles, bed rails, taps and switches are touched again and again by the patient, the family and visitors.",
      },
      {
        title: "Families already do so much.",
        body: "Medicines, meals, appointments and support. We take care of the surfaces, so that is one less thing to think about.",
      },
    ],
  },

  whoFor: [
    "Families bringing someone home after an organ or bone-marrow transplant",
    "People recovering from cancer treatment",
    "People on dialysis or receiving kidney care",
    "People taking long-term medicines that lower immunity",
    "Anyone coming home after major surgery",
    "Other patients their treating team feels may benefit",
  ],

  touchpoints: [
    {
      area: "Bedroom",
      surfaces: ["Bed rails", "Bedside tables", "Light switches", "Door handles"],
    },
    {
      area: "Bathroom",
      surfaces: ["Taps and sink handles", "Flush handles", "Toilet seats", "Grab bars"],
    },
    {
      area: "Kitchen and dining",
      surfaces: ["Fridge handles", "Microwave panels", "Dining tables and chairs"],
    },
    {
      area: "Living areas",
      surfaces: ["Remote controls", "Main door handles and locks", "Stair rails and handrails"],
    },
  ],

  steps: [
    {
      title: "Talk it through.",
      body: "We speak with the family, go through the discharge advice they have been given and explain how the programme works. Nothing is scheduled without their agreement.",
    },
    {
      title: "Assess the home.",
      body: "A trained technician walks through the home, identifies the high-touch surfaces the patient will use most and agrees a treatment plan with the family.",
    },
    {
      title: "Prepare and apply.",
      body: "Surfaces are cleaned, then ProteGo Surface Protectant is applied with ultra-low-volume (ULV) equipment for even coverage. Treated areas are ready once dry, in about an hour.",
    },
    {
      title: "Verify.",
      body: "We take ATP readings before and after application. ATP testing measures surface cleanliness (organic residue) in Relative Light Units, as an objective check on the work.",
    },
    {
      title: "Report and hand over.",
      body: "The family receives a report with the readings, what they mean and simple guidance for the weeks ahead. A follow-up reading at around 28 days is recommended.",
    },
  ],

  partners: {
    title: "For hospitals and care teams.",
    body: "Hospital to Home™ is designed to be evaluated, not adopted on faith. We work with discharge planning, infection prevention and quality teams to try the programme on a limited scale first, often a pilot in a nephrology, oncology or transplant department. Clinical judgement remains with the treating team, and the programme complements, not replaces, existing infection-prevention practice.",
  },

  privacy:
    "We arrange a visit only with the patient's or family's consent, whether they contact us directly or are referred by their hospital. Their details are used to plan and carry out the visit and to share its report, and they can ask us to correct or delete them at any time.",

  faqs: [
    {
      q: "Does this replace cleaning or medical advice?",
      a: "No. It complements, not replaces, routine cleaning, hand hygiene and the advice of the treating team. Please keep following the care plan you were given at discharge.",
    },
    {
      q: "How long does the protection last?",
      a: "Up to 30 days on treated surfaces under normal conditions. It can vary with cleaning, wear and how the room is used, which is why we recommend a follow-up reading at around 28 days.",
    },
    {
      q: "Which surfaces do you treat?",
      a: "Hard, high-touch surfaces that are compatible with the protectant, agreed with the family during the assessment. We do not treat food or food-contact surfaces.",
    },
    {
      q: "What happens on the day?",
      a: "A technician prepares and treats the agreed surfaces, takes ATP readings before and after, and explains the report. Treated areas are ready once dry, in about an hour.",
    },
    {
      q: "Do we need a referral from the hospital?",
      a: "No, families can contact us directly. Not every patient needs Hospital to Home™, so we suggest discussing it with the treating team as well.",
    },
  ],

  line: "Protecting recovery, one surface at a time.",
};
