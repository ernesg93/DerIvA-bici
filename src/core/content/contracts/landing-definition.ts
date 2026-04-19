import type { HeroContent } from "@/src/core/hero/types";
import type { SeoDefinition } from "@/src/core/seo/types";

export type LandingCta = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  openInNewTab?: boolean;
};

export type LandingCtaGroup = {
  id?: string;
  label?: string;
  ctas: LandingCta[];
};

export type LandingOfferBlock = {
  eyebrow?: string;
  title: string;
  description: string;
  highlights?: string[];
  ctaGroup?: LandingCtaGroup;
};

export type LandingSectionBase = {
  id: string;
  title: string;
  description?: string;
};

export type LandingContentSection = LandingSectionBase & {
  kind: "content";
  items?: string[];
  ctaGroup?: LandingCtaGroup;
};

export type LandingTrustSection = LandingSectionBase & {
  kind: "trust";
  items: Array<{
    title: string;
    detail?: string;
  }>;
};

export type LandingFaqSection = LandingSectionBase & {
  kind: "faq";
  items: Array<{
    question: string;
    answer: string;
  }>;
};

export type LandingSection =
  | LandingContentSection
  | LandingTrustSection
  | LandingFaqSection;

export type LandingDefinition = {
  brandId: string;
  headline: string;
  subheadline: string;
  seo: SeoDefinition;
  hero: HeroContent;
  offer?: LandingOfferBlock;
  ctaGroups?: LandingCtaGroup[];
  sections?: LandingSection[];
};
