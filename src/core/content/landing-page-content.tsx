import type { LandingDefinition } from "@/src/core/content/contracts/landing-definition";
import { HeroPreview } from "@/src/core/hero/hero-preview";

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
      <p className="eyebrow">Brand: {landing.brandId}</p>
      <h1>{landing.headline}</h1>
      <p className="description">{landing.subheadline}</p>

      <section className="hero-box" aria-label="Hero configuration preview">
        <h2>Hero configuration</h2>
        <HeroPreview hero={landing.hero} />
      </section>
    </main>
  );
}
