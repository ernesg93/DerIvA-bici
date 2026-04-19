export type HeroSequenceManifest = {
  src: string;
};

export type HeroOverlayPosition = "top" | "center" | "bottom";

export type HeroOverlayTone = "primary" | "secondary";

export type HeroOverlayCta = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

export type HeroNarrativeOverlay = {
  id: string;
  start: number;
  end: number;
  position: HeroOverlayPosition;
  heading?: string;
  body?: string;
  accent?: string;
  accentTone?: HeroOverlayTone;
  ctas?: HeroOverlayCta[];
};

export type HeroSequenceNarrative = {
  ariaLabel?: string;
  loaderLabel?: string;
  scrollHintLabel?: string;
  overlays: HeroNarrativeOverlay[];
  showScrollHint?: boolean;
};

export type HeroFallback = {
  posterSrc: string;
  staticImageSrc?: string;
  ariaLabel?: string;
  imageAlt?: string;
};

export type HeroDegradationStrategy = {
  onReducedMotion?: "poster" | "static-image";
  onLowPowerDevice?: "poster" | "static-image";
  onManifestLoadError: "poster" | "static-image";
};

export type HeroSequenceConfig = {
  framesBasePath: string;
  frameFilePattern: string;
  frameCount: number;
  fps: number;
  manifest: HeroSequenceManifest;
  fallback: HeroFallback;
  degradation: HeroDegradationStrategy;
  posterFrame?: number;
  viewportScrollHeightVh?: number;
  narrative?: HeroSequenceNarrative;
};

export type HeroContent =
  | {
      kind: "sequence";
      sequence: HeroSequenceConfig;
    }
  | {
      kind: "image";
      image: {
        src: string;
      };
    };
