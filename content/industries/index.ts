import { INDUSTRY_GROUPS, type Industry } from "./types";
import { industry as healthcare } from "./healthcare";
import { industry as education } from "./education";
import { industry as hotels } from "./hotels-and-resorts";
import { industry as restaurants } from "./restaurants-and-banquets";
import { industry as foodService } from "./food-service";
import { industry as foodManufacturing } from "./food-manufacturing";
import { industry as pharmaceutical } from "./pharmaceutical";
import { industry as offices } from "./offices";
import { industry as retail } from "./retail";
import { industry as multiplexes } from "./multiplexes";
import { industry as gyms } from "./gyms-spas-and-salons";
import { industry as airports } from "./airports";
import { industry as railways } from "./railways";
import { industry as government } from "./government";
import { industry as residential } from "./residential";

export type { Industry, IndustryGroup } from "./types";
export { INDUSTRY_GROUPS };

// Order shown on /industries
export const INDUSTRIES: Industry[] = [
  healthcare,
  education,
  hotels,
  restaurants,
  foodService,
  offices,
  retail,
  multiplexes,
  gyms,
  airports,
  railways,
  government,
  foodManufacturing,
  pharmaceutical,
  residential,
];

export function industryBySlug(slug: string) {
  return INDUSTRIES.find((i) => i.slug === slug);
}

