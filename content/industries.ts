import { Building2, Factory, GraduationCap, Hospital, Plane, UtensilsCrossed, type LucideIcon } from "lucide-react";

// Industry groups (same values as design A's IndustryExplorer)
export const INDUSTRIES: { icon: LucideIcon; name: string; covers: string; hotspots: string[]; line: string }[] = [
  {
    icon: Hospital,
    name: "Healthcare",
    covers: "Hospitals, clinics and recovery at home",
    hotspots: ["Bed rails", "Nurse stations", "OPD waiting areas", "Lift buttons", "Door handles", "Medical equipment"],
    line: "Protective care begins with protecting every surface.",
  },
  {
    icon: GraduationCap,
    name: "Education",
    covers: "Schools, colleges and campuses",
    hotspots: ["Desks", "Science labs", "Libraries", "Washrooms", "Canteens", "School buses"],
    line: "A clean school today builds a healthier generation tomorrow.",
  },
  {
    icon: UtensilsCrossed,
    name: "Hospitality and food",
    covers: "Hotels, restaurants, QSRs, cafés and cloud kitchens",
    hotspots: ["Guest rooms", "Lobbies", "Dining tables", "Menus", "Cash desks", "Delivery stations"],
    line: "In hospitality, hygiene is part of the experience.",
  },
  {
    icon: Building2,
    name: "Workplaces and retail",
    covers: "Offices, tech parks, malls, multiplexes and gyms",
    hotspots: ["Lift buttons", "Turnstiles", "Workstations", "Meeting rooms", "Escalator handrails", "Gym equipment"],
    line: "Protect better. Operate smarter.",
  },
  {
    icon: Plane,
    name: "Travel and public spaces",
    covers: "Airports, railways and government buildings",
    hotspots: ["Check-in kiosks", "Security trays", "Gate seating", "Grab rails", "Coach washrooms", "Service counters"],
    line: "Travel is evolving. Hygiene should too.",
  },
  {
    icon: Factory,
    name: "Manufacturing",
    covers: "Pharma and food processing",
    hotspots: ["Change and gowning rooms", "Corridors", "Access control", "Staff cafeterias", "Packaging and dispatch", "Washrooms"],
    line: "Take hygiene from reactive to reliable.",
  },
];
