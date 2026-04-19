import type {
  LandingCtaGroup,
  LandingDefinition
} from "@/src/core/content/contracts/landing-definition";
import { HeroRenderer } from "@/src/core/hero/hero-renderer";

type LandingPageContentProps = {
  landing?: LandingDefinition;
};

function LandingCtaLinks({
  ctaGroup,
  groupClassName
}: {
  ctaGroup: LandingCtaGroup;
  groupClassName?: string;
}) {
  return (
    <div className={groupClassName ?? "landing-cta-group"}>
      {ctaGroup.ctas.map((cta) => (
        <a
          key={`${cta.href}-${cta.label}`}
          href={cta.href}
          className={`landing-cta landing-cta--${cta.variant ?? "primary"}`}
          target={cta.openInNewTab ? "_blank" : undefined}
          rel={cta.openInNewTab ? "noopener noreferrer" : undefined}
        >
          {cta.label}
        </a>
      ))}
    </div>
  );
}

function LandingSections({ sections }: { sections: NonNullable<LandingDefinition["sections"]> }) {
  return (
    <div className="landing-sections">
      {sections.map((section) => {
        if (section.kind === "trust") {
          return (
            <section key={section.id} className="landing-section" aria-label={section.title}>
              <h2>{section.title}</h2>
              {section.description ? <p className="description">{section.description}</p> : null}
              <ul className="landing-trust-list">
                {section.items.map((item) => (
                  <li key={item.title}>
                    <h3>{item.title}</h3>
                    {item.detail ? <p>{item.detail}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (section.kind === "faq") {
          return (
            <section key={section.id} className="landing-section" aria-label={section.title}>
              <h2>{section.title}</h2>
              {section.description ? <p className="description">{section.description}</p> : null}
              <div className="landing-faq-list">
                {section.items.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          );
        }

        if (section.kind === "feature-grid") {
          return (
            <section key={section.id} className="landing-section" aria-label={section.title}>
              <h2>{section.title}</h2>
              {section.description ? <p className="description">{section.description}</p> : null}
              <ul className="landing-feature-grid">
                {section.items.map((item) => (
                  <li key={item.title}>
                    {item.badge ? <p className="eyebrow">{item.badge}</p> : null}
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (section.kind === "social-proof") {
          return (
            <section key={section.id} className="landing-section" aria-label={section.title}>
              <h2>{section.title}</h2>
              {section.description ? <p className="description">{section.description}</p> : null}
              <ul className="landing-social-proof">
                {section.items.map((item) => (
                  <li key={`${item.author}-${item.quote}`}>
                    <blockquote>“{item.quote}”</blockquote>
                    <p className="landing-social-proof-author">{item.author}</p>
                    {item.role || item.location ? (
                      <p className="landing-social-proof-meta">
                        {[item.role, item.location].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                    {item.outcome ? <p className="landing-social-proof-outcome">{item.outcome}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (section.kind === "metrics") {
          return (
            <section key={section.id} className="landing-section" aria-label={section.title}>
              <h2>{section.title}</h2>
              {section.description ? <p className="description">{section.description}</p> : null}
              <ul className="landing-metrics-grid">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <p className="landing-metric-value">{item.value}</p>
                    <p className="landing-metric-label">{item.label}</p>
                    {item.detail ? <p className="landing-metric-detail">{item.detail}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        return (
          <section key={section.id} className="landing-section" aria-label={section.title}>
            <h2>{section.title}</h2>
            {section.description ? <p className="description">{section.description}</p> : null}
            {section.items?.length ? (
              <ul className="landing-content-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.ctaGroup ? <LandingCtaLinks ctaGroup={section.ctaGroup} /> : null}
          </section>
        );
      })}
    </div>
  );
}

export function LandingPageContent({ landing }: LandingPageContentProps) {
  if (!landing) {
    return <main className="page" />;
  }

  return (
    <main className="page">
      <HeroRenderer
        hero={landing.hero}
        headline={landing.headline}
        subheadline={landing.subheadline}
      />

      <section className="landing-copy">
        <h1>{landing.headline}</h1>
        <p className="description">{landing.subheadline}</p>

        {landing.offer ? (
          <section className="landing-offer">
            {landing.offer.eyebrow ? (
              <p className="eyebrow">{landing.offer.eyebrow}</p>
            ) : null}
            <h2>{landing.offer.title}</h2>
            <p className="description">{landing.offer.description}</p>
            {landing.offer.highlights?.length ? (
              <ul className="landing-offer-highlights">
                {landing.offer.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ) : null}
            {landing.offer.ctaGroup ? (
              <LandingCtaLinks ctaGroup={landing.offer.ctaGroup} />
            ) : null}
          </section>
        ) : null}

        {landing.ctaGroups?.length
          ? landing.ctaGroups.map((ctaGroup) => (
              <section key={ctaGroup.id ?? ctaGroup.label ?? "general-cta"}>
                {ctaGroup.label ? <h2>{ctaGroup.label}</h2> : null}
                <LandingCtaLinks ctaGroup={ctaGroup} />
              </section>
            ))
          : null}

        {landing.sections?.length ? <LandingSections sections={landing.sections} /> : null}
      </section>
    </main>
  );
}
