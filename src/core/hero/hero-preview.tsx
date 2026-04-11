import type { HeroContent } from "@/src/core/hero/types";

type HeroPreviewProps = {
  hero: HeroContent;
};

export function HeroPreview({ hero }: HeroPreviewProps) {
  switch (hero.kind) {
    case "sequence":
      return (
        <ul>
          <li>Type: image sequence</li>
          <li>Frames path: {hero.sequence.framesBasePath}</li>
          <li>Pattern: {hero.sequence.frameFilePattern}</li>
          <li>Total frames: {hero.sequence.frameCount}</li>
          <li>Playback fps: {hero.sequence.fps}</li>
        </ul>
      );

    case "image":
      return (
        <ul>
          <li>Type: static image</li>
          <li>Source: {hero.image.src}</li>
        </ul>
      );

    default:
      return null;
  }
}
