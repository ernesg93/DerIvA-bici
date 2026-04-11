import type { Metadata } from "next";
import { LandingPageContent } from "@/src/core/content/landing-page-content";
import { resolveLandingDefinition } from "@/src/core/content/landing-resolution";
import * as landingRegistry from "@/src/brands/registry";
import { getLandingMetadata } from "@/src/core/seo/metadata";

type HomePageProps = {
  searchParams?: {
    brand?: string | string[];
  };
};

export function generateMetadata({ searchParams }: HomePageProps): Metadata {
  const landing = resolveLandingDefinition(searchParams, landingRegistry);

  return getLandingMetadata(landing);
}

export default function HomePage({ searchParams }: HomePageProps) {
  const landing = resolveLandingDefinition(searchParams, landingRegistry);

  return <LandingPageContent landing={landing} />;
}
