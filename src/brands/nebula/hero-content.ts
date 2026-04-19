import type { HeroSequenceNarrative } from "@/src/core/hero/types";

export const nebulaHeroNarrative: HeroSequenceNarrative = {
  ariaLabel: "Experiencia visual scrollytelling de Nebula Commerce",
  loaderLabel: "Cargando experiencia visual de Nebula Commerce",
  scrollHintLabel: "Scroll",
  showScrollHint: true,
  overlays: [
    {
      id: "intro",
      start: 0,
      end: 0.18,
      position: "top",
      heading: "NEBULA COMMERCE",
      body: "Conversión visual y narrativa inmersiva para landings de alto impacto.",
      ctas: [
        {
          label: "Ver demo",
          href: "#",
          variant: "secondary"
        }
      ]
    },
    {
      id: "message-1",
      start: 0.25,
      end: 0.48,
      position: "bottom",
      heading: "Secuencia real en canvas,",
      accent: "controlada por scroll.",
      accentTone: "primary"
    },
    {
      id: "message-2",
      start: 0.56,
      end: 0.78,
      position: "bottom",
      heading: "Manifest + poster fallback",
      accent: "sin hardcodear la marca en core.",
      accentTone: "secondary"
    },
    {
      id: "cta",
      start: 0.84,
      end: 1,
      position: "center",
      heading: "Primer vertical slice integrado",
      ctas: [
        {
          label: "Explorar integración",
          href: "#",
          variant: "primary"
        }
      ]
    }
  ]
};
