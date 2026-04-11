import type { Metadata } from "next";
import type { LandingDefinition } from "@/src/core/content/contracts/landing-definition";
import type { SeoDefinition } from "@/src/core/seo/types";
import { platformSeoDefinition } from "@/src/core/seo/contracts";
import { toMetadata } from "@/src/core/seo/to-metadata";

export function getPlatformMetadata(): Metadata {
  return toMetadata(platformSeoDefinition);
}

export function getLandingMetadata(landing?: LandingDefinition): Metadata {
  const seo: SeoDefinition = landing?.seo ?? platformSeoDefinition;

  return toMetadata(seo);
}
