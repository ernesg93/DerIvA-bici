import type { LandingDefinition } from "@/src/core/content/contracts/landing-definition";

export const nebulaLandingDefinition: LandingDefinition = {
  brandId: "nebula",
  headline: "Nebula Commerce",
  subheadline: "Plataforma enfocada en conversión visual y experiencia inmersiva.",
  seo: {
    title: "Nebula Commerce",
    description: "Landing inicial para Nebula en la plataforma unificada.",
    openGraphImage: "/hero-frames/nebula/cover.jpg"
  },
  hero: {
    kind: "sequence",
    sequence: {
      framesBasePath: "/hero-frames/nebula",
      frameFilePattern: "frame-{index}.jpg",
      frameCount: 120,
      fps: 24,
      manifest: {
        src: "/hero-frames/nebula/manifest.json"
      },
      fallback: {
        posterSrc: "/hero-frames/nebula/cover.jpg",
        staticImageSrc: "/hero-frames/nebula/cover.jpg"
      },
      degradation: {
        onReducedMotion: "poster",
        onLowPowerDevice: "poster",
        onManifestLoadError: "poster"
      },
      posterFrame: 1
    }
  }
};
