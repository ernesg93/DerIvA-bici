import type { LandingDefinition } from "@/src/core/content/contracts/landing-definition";
import { nebulaLandingDefinition } from "@/src/brands/nebula";
import { ventabiciLandingDefinition } from "@/src/brands/ventabici";

const landingDefinitions = [
  nebulaLandingDefinition,
  ventabiciLandingDefinition
] as const;

type RegisteredLanding = (typeof landingDefinitions)[number];
export type RegisteredBrandId = RegisteredLanding["brandId"];

const registry = new Map<string, LandingDefinition>(
  landingDefinitions.map((definition) => [definition.brandId, definition])
);

export function getLandingDefinition(
  brandId?: string
): LandingDefinition | undefined {
  if (!brandId) {
    return undefined;
  }

  return registry.get(brandId);
}

export function getDefaultLandingDefinition(): LandingDefinition | undefined {
  return landingDefinitions[0];
}

export function getRegisteredBrandIds(): string[] {
  return [...registry.keys()];
}
