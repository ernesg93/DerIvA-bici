import type { HeroContent } from "@/src/core/hero/types";
import type { SeoDefinition } from "@/src/core/seo/types";

export type LandingDefinition = {
  brandId: string;
  headline: string;
  subheadline: string;
  seo: SeoDefinition;
  hero: HeroContent;
};
