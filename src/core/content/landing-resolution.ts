import type { LandingDefinition } from "@/src/core/content/contracts/landing-definition";

export type LandingRegistry = {
  getLandingDefinition: (brandId?: string) => LandingDefinition | undefined;
  getDefaultLandingDefinition: () => LandingDefinition | undefined;
};

export type BrandSearchParams = {
  brand?: string | string[];
};

export function normalizeBrandParam(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function resolveLandingDefinition(
  searchParams: BrandSearchParams | undefined,
  registry: LandingRegistry
): LandingDefinition | undefined {
  const requestedBrand = normalizeBrandParam(searchParams?.brand);

  return (
    registry.getLandingDefinition(requestedBrand) ??
    registry.getDefaultLandingDefinition()
  );
}
