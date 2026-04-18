import type { LandingDefinition } from "@/src/core/content/contracts/landing-definition";

export const ventabiciLandingDefinition: LandingDefinition = {
  brandId: "ventabici",
  headline: "Ventabici",
  subheadline: "Solución modular para catálogos de bicicletas y accesorios.",
  seo: {
    title: "Ventabici",
    description: "Landing inicial para Ventabici en la plataforma unificada.",
    openGraphImage: "/hero-frames/ventabici/cover.svg"
  },
  hero: {
    kind: "image",
    image: {
      src: "/hero-frames/ventabici/cover.svg"
    }
  }
};
