import type { HeroContent } from "@/src/core/hero/types";
import { SequenceHeroRuntime } from "@/src/core/hero/sequence-hero-runtime";

type HeroRendererProps = {
  hero: HeroContent;
  headline: string;
  subheadline: string;
};

export function HeroRenderer({ hero, headline, subheadline }: HeroRendererProps) {
  if (hero.kind === "sequence") {
    return <SequenceHeroRuntime config={hero.sequence} />;
  }

  return (
    <section className="hero-image-shell" aria-label="Hero image">
      <img src={hero.image.src} alt={headline} className="hero-image" />
      <div className="hero-image-overlay">
        <h1>{headline}</h1>
        <p>{subheadline}</p>
      </div>
    </section>
  );
}
