import {
  Atom,
  FlaskConical,
  Layers,
  Archive,
  Armchair,
  BookOpen,
  Coffee,
  CreditCard,
  Droplet,
  Droplets,
  Fingerprint,
  Footprints,
  Keyboard,
  KeyRound,
  Lamp,
  Luggage,
  Microwave,
  Printer,
  Refrigerator,
  ShoppingCart,
  Smartphone,
  Tablet,
  Toilet,
  ToggleLeft,
  Trash2,
  Truck,
  Tv,
  Pill,
  Ribbon,
  ArrowUpDown,
  Baby,
  Bath,
  BedDouble,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  Bus,
  CalendarCheck,
  Car,
  ChefHat,
  Clapperboard,
  ClipboardCheck,
  ClipboardList,
  Clock,
  ConciergeBell,
  DoorOpen,
  Dumbbell,
  Eye,
  Factory,
  FileText,
  Gauge,
  GraduationCap,
  Hand,
  HeartHandshake,
  HeartPulse,
  Hospital,
  House,
  Landmark,
  Lightbulb,
  Lock,
  MessageCircle,
  Microscope,
  Monitor,
  Package,
  Plane,
  RefreshCw,
  Route,
  Shirt,
  ShieldCheck,
  ShoppingBag,
  Smile,
  Sofa,
  Sparkles,
  SprayCan,
  Star,
  Stethoscope,
  Timer,
  TrainFront,
  Trees,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/*
  Icons for text that comes from content files (zones, people, points, steps). Each list is
  checked in order and the first keyword match wins, so put specific words before general ones.
*/
type Rule = [RegExp, LucideIcon];

function match(rules: Rule[], text: string, fallback: LucideIcon) {
  return rules.find(([re]) => re.test(text))?.[1] ?? fallback;
}

// rooms and areas: "Washrooms", "Lifts and stairways", "Reception and waiting areas"…
const ZONES: Rule[] = [
  [/wash|bath|toilet|restroom|shower/i, Bath],
  [/bed|ward|guest room|bedroom|patient room/i, BedDouble],
  [/kitchen|dining|cafeteria|canteen|food court|restaurant|café|cafe|banquet|meal|pantry/i, UtensilsCrossed],
  [/lift|elevator|stair|escalator/i, ArrowUpDown],
  [/reception|lobby|waiting|entrance|front desk|foyer|check-in|concierge/i, ConciergeBell],
  [/nurse|opd|clinic|consult|medical|treatment/i, Stethoscope],
  [/class|school|library|lecture|student/i, GraduationCap],
  [/lab|qc|testing/i, Microscope],
  [/gym|fitness|studio|spa|salon|locker room/i, Dumbbell],
  [/auditor|cinema|screen|seating|seat/i, Clapperboard],
  [/platform|station|train|coach|rail/i, TrainFront],
  [/terminal|gate|airport|lounge|security|baggage/i, Plane],
  [/store|shop|mall|retail|checkout|till|fitting/i, ShoppingBag],
  [/change|gown|locker/i, Shirt],
  [/warehouse|dispatch|loading|production|factory|packag|plant/i, Factory],
  [/office|desk|workstation|admin|meeting|board|cabin/i, Briefcase],
  [/bus|vehicle|transport|parking|fleet/i, Bus],
  [/living|lounge|common|sofa|clubhouse/i, Sofa],
  [/park|play|garden|outdoor/i, Trees],
  [/service centre|public|civic|counter|citizen/i, Landmark],
  [/corridor|door|access|turnstile|entry|exit|hallway/i, DoorOpen],
  [/device|keyboard|screen|kiosk|computer/i, Monitor],
];

// individual surfaces: "Bed rails", "Taps and sink handles", "POS terminals"…
const SURFACES: Rule[] = [
  [/lift|escalator|travelator/i, ArrowUpDown],
  [/bus /i, Bus],
  [/flush|toilet|cubicle/i, Toilet],
  [/tap|basin|sink|shower|hand-wash|water dispenser/i, Droplets],
  [/soap|towel|dryer|napkin/i, Droplet],
  [/switch|fan/i, ToggleLeft],
  [/remote/i, Tv],
  [/fridge|refrigerator|freezer|appliance/i, Refrigerator],
  [/microwave/i, Microwave],
  [/coffee|vending/i, Coffee],
  [/pos|payment|card/i, CreditCard],
  [/biometric|attendance|access|intercom|keypad/i, Fingerprint],
  [/printer|copier/i, Printer],
  [/phone|charging/i, Smartphone],
  [/kiosk|screen|av panel|booking/i, Tablet],
  [/keyboard|device|scanner/i, Keyboard],
  [/menu|wine list|library|book/i, BookOpen],
  [/baggage|screening tray|divesting/i, Luggage],
  [/trolley|pallet/i, ShoppingCart],
  [/loading|dispatch/i, Truck],
  [/gym|dumbbell|kettlebell|treadmill|machine|rack|sports/i, Dumbbell],
  [/lab bench/i, Microscope],
  [/bedside/i, Lamp],
  [/bed/i, BedDouble],
  [/dining|tabletop|table accessor|tray return|bar /i, UtensilsCrossed],
  [/locker|cabinet|wardrobe|storage|shelf/i, Archive],
  [/bin/i, Trash2],
  [/lock|latch/i, KeyRound],
  [/door|push|gate|turnstile|letterbox|partition/i, DoorOpen],
  [/stair|ramp|banister|balustrade|balcony/i, Footprints],
  [/seat|chair|armrest|bench|stool|footrest|furniture/i, Armchair],
  [/shared desk|desk top|desk surface|desk edge|desks and/i, Briefcase],
  [/desk|counter|reception|station|kiosk|host|box office|service/i, ConciergeBell],
  [/meeting|table/i, Briefcase],
];

// stakeholders: "Patients and visitors", "Parents", "General managers"…
const PEOPLE: Rule[] = [
  [/patient/i, HeartPulse],
  [/student|child|pupil/i, GraduationCap],
  [/parent|famil|caregiver|carer/i, HeartHandshake],
  [/guest|customer|visitor|diner|shopper|passenger|member|audience|traveller|commuter|citizen|public/i, Smile],
  [/resident|home|household/i, House],
  [/quality|qa|compliance|audit|regulator|inspector/i, ClipboardCheck],
  [/authorit|government|municipal|administrator/i, Landmark],
  [/owner|manager|leader|director|operator|management|franchise|chain|group|head/i, BriefcaseBusiness],
  [/clinical|nurse|doctor|medical/i, Stethoscope],
  [/teacher|staff|team|employee|tenant|worker|crew|housekeep/i, Users],
];

// challenge points, approach notes, "why" points
const POINTS: Rule[] = [
  [/hospital to home|recovery|discharge/i, HeartPulse],
  [/home|address/i, House],
  [/hospital|clinic|healthcare/i, Hospital],
  [/famil|care team|support/i, HeartHandshake],
  [/touch|hand|surface/i, Hand],
  [/child|student|school|learn/i, GraduationCap],
  [/inspect|record|document|audit|fssai|compliance|sop|qa|regulat|scope|change control/i, ClipboardCheck],
  [/reviews|reputation|rating|impression/i, Star],
  [/trust|confidence|standard|protected space|certificate/i, ShieldCheck],
  [/time|schedule|downtime|round|shift|service hours|show|timetable|window|after hours/i, Clock],
  [/see|visible|notice|detail/i, Eye],
  [/many|busy|crowd|footfall|people|share|guest|journey|passenger|visitor/i, Users],
  [/diy|kit|bottle/i, SprayCan],
  [/one|outlet|network|chain|portfolio|site|depot|proposal|societ|communit|apartment/i, Building2],
  [/food|kitchen|meal|chef/i, ChefHat],
  [/product|production|packag/i, Package],
  [/vehicle|car/i, Car],
  [/baby|infant/i, Baby],
  [/lock|privacy|consent/i, Lock],
];

// process steps: "Talk it through", "Clean", "Spray", "Verify"…
const STEPS: Rule[] = [
  [/talk|consult|discuss|call/i, MessageCircle],
  [/assess|map|survey|plan/i, ClipboardList],
  [/clean/i, Sparkles],
  [/spray|apply|prepare|protect/i, SprayCan],
  [/dry|wait|hour/i, Timer],
  [/verify|test|atp|measure|reading/i, Gauge],
  [/report|hand over|certif|document/i, FileText],
  [/renew|repeat|reapply/i, RefreshCw],
];

export const zoneIcon = (t: string) => match(ZONES, t, ShieldCheck);
export const surfaceIcon = (t: string) => match(SURFACES, t, Hand);
export const personIcon = (t: string) => match(PEOPLE, t, Users);
/** title wins; the body is only consulted when the title has no keyword */
export const pointIcon = (title: string, body = "") => match(POINTS, title, match(POINTS, body, Lightbulb));
export const stepIcon = (t: string) => match(STEPS, t, Route);

// Hospital to Home™ "who it's for" lines
const CONDITIONS: Rule[] = [
  [/transplant/i, HeartPulse],
  [/cancer/i, Ribbon],
  [/dialysis|kidney/i, Droplets],
  [/medicine|immun/i, Pill],
  [/surgery/i, Stethoscope],
];
export const conditionIcon = (t: string) => match(CONDITIONS, t, Users);

// product fact labels (PRODUCT_FACTS in content/products.ts)
export const FACT_ICONS: Record<string, LucideIcon> = {
  Protection: ShieldCheck,
  Technology: Atom,
  Format: SprayCan,
  Composition: Droplets,
  "Drying time": Timer,
  Properties: Layers,
  Testing: FlaskConical,
  "Use on": Hand,
};

// fixed icons for the plan tiers
export const PLAN_ICONS: Record<string, LucideIcon> = {
  Professional: ShieldCheck,
  "12-Month": CalendarCheck,
  "Long-Term Partnership": Building2,
};

/* A bare icon from a lookup (keeps the lookup out of render, for the React compiler lint). */
export function Glyph({ icon: Icon, className = "" }: { icon: LucideIcon; className?: string }) {
  return <Icon aria-hidden strokeWidth={1.8} className={className} />;
}

/* The rounded square that holds an icon. Tones match the section the card sits in. */
export function IconBadge({
  icon: Icon,
  tone = "deep",
  size = "md",
  className = "",
}: {
  icon: LucideIcon;
  tone?: "deep" | "tint" | "turquoise" | "glass";
  size?: "sm" | "md";
  className?: string;
}) {
  const tones = {
    deep: "bg-sherpa-deep text-turquoise",
    tint: "bg-turquoise-tint text-sherpa",
    turquoise: "bg-turquoise text-sherpa-deep",
    glass: "bg-white/10 text-turquoise ring-1 ring-white/15",
  };
  const sizes = { sm: "size-9 rounded-xl [&>svg]:size-[18px]", md: "size-12 rounded-2xl [&>svg]:size-6" };
  return (
    <span className={`grid shrink-0 place-items-center ${tones[tone]} ${sizes[size]} ${className}`}>
      <Icon aria-hidden strokeWidth={1.6} />
    </span>
  );
}
