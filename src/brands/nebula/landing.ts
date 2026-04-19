import type { LandingDefinition } from "@/src/core/content/contracts/landing-definition";
import { nebulaHeroNarrative } from "@/src/brands/nebula/hero-content";

export const nebulaLandingDefinition: LandingDefinition = {
  brandId: "nebula",
  headline: "Nebula Commerce",
  subheadline: "Plataforma enfocada en conversión visual y experiencia inmersiva.",
  seo: {
    title: "Nebula Commerce",
    description: "Landing inicial para Nebula en la plataforma unificada.",
    openGraphImage: "/hero-frames/nebula/Iced_coffee_splash_202604041152_000.jpg"
  },
  hero: {
    kind: "sequence",
    sequence: {
      framesBasePath: "/hero-frames/nebula",
      frameFilePattern: "Iced_coffee_splash_202604041152_{index0:3}.jpg",
      frameCount: 80,
      fps: 24,
      manifest: {
        src: "/hero-frames/nebula/manifest.json"
      },
      fallback: {
        posterSrc: "/hero-frames/nebula/Iced_coffee_splash_202604041152_000.jpg",
        staticImageSrc: "/hero-frames/nebula/Iced_coffee_splash_202604041152_000.jpg",
        ariaLabel: "Imagen de respaldo del hero de Nebula Commerce",
        imageAlt: "Fotograma de respaldo del hero de Nebula Commerce"
      },
      degradation: {
        onReducedMotion: "poster",
        onLowPowerDevice: "poster",
        onManifestLoadError: "poster"
      },
      posterFrame: 0,
      viewportScrollHeightVh: 360,
      narrative: nebulaHeroNarrative
    }
  }
};
