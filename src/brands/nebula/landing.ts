import type { LandingDefinition } from "@/src/core/content/contracts/landing-definition";
import { nebulaHeroNarrative } from "@/src/brands/nebula/hero-content";

export const nebulaLandingDefinition: LandingDefinition = {
  brandId: "nebula",
  headline: "Nebula Commerce",
  subheadline: "Plataforma enfocada en conversión visual y experiencia inmersiva.",
  seo: {
    title: "Nebula Commerce",
    description: "Landing inicial para Nebula en la plataforma unificada.",
    openGraphImage: "/hero-frames/nebula/cover.svg"
  },
  hero: {
    kind: "sequence",
    sequence: {
      framesBasePath: "/hero-frames/nebula",
      frameFilePattern: "frame-{index:3}.svg",
      frameCount: 3,
      fps: 24,
      manifest: {
        src: "/hero-frames/nebula/manifest.json"
      },
      fallback: {
        posterSrc: "/hero-frames/nebula/cover.svg",
        staticImageSrc: "/hero-frames/nebula/cover.svg"
      },
      degradation: {
        onReducedMotion: "poster",
        onLowPowerDevice: "poster",
        onManifestLoadError: "poster"
      },
      posterFrame: 1,
      viewportScrollHeightVh: 360,
      narrative: nebulaHeroNarrative
    }
  }
};
