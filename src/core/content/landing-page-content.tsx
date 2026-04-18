import type { LandingDefinition } from "@/src/core/content/contracts/landing-definition";
import { HeroRenderer } from "@/src/core/hero/hero-renderer";

type LandingPageContentProps = {
  landing?: LandingDefinition;
};

export function LandingPageContent({ landing }: LandingPageContentProps) {
  if (!landing) {
    return (
      <main className="page">
        <h1>Unificadora</h1>
        <p>No hay marcas registradas todavía.</p>
      </main>
    );
  }

  return (
    <main className="page">
      <HeroRenderer
        hero={landing.hero}
        headline={landing.headline}
        subheadline={landing.subheadline}
      />

      <section className="landing-copy" aria-label="Landing summary">
        <p className="eyebrow">Brand: {landing.brandId}</p>
        <h1>{landing.headline}</h1>
        <p className="description">{landing.subheadline}</p>
      </section>
    </main>
  );
}
