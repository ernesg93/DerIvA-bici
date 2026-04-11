export type HeroSequenceManifest = {
  src: string;
};

export type HeroFallback = {
  posterSrc: string;
  staticImageSrc?: string;
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
