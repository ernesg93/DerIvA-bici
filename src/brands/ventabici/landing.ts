import type { LandingDefinition } from "@/src/core/content/contracts/landing-definition";

export const ventabiciLandingDefinition: LandingDefinition = {
  brandId: "ventabici",
  headline: "Vendé tu bici en días, no en meses",
  subheadline:
    "Ventabici combina tasación orientativa, publicación guiada y alcance comercial para acelerar ventas reales.",
  seo: {
    title: "Ventabici | Publicá y vendé bicicletas con respaldo comercial",
    description:
      "Landing comercial/editorial de Ventabici para captar leads y activar ventas de bicicletas usadas y nuevas.",
    openGraphImage: "/hero-frames/ventabici/cover.svg"
  },
  hero: {
    kind: "image",
    image: {
      src: "/hero-frames/ventabici/cover.svg"
    }
  },
  offer: {
    eyebrow: "Plataforma comercial",
    title: "Una oferta pensada para convertir intención en operación",
    description:
      "Te acompañamos desde la publicación hasta el cierre con una estructura simple para compradores y vendedores.",
    highlights: [
      "Publicación optimizada para destacar estado real y equipamiento",
      "Soporte comercial para consultas y negociación inicial",
      "Canales de difusión segmentados para ciclistas urbanos y de ruta"
    ],
    ctaGroup: {
      id: "ventabici-offer-cta",
      ctas: [
        {
          label: "Publicar bicicleta",
          href: "#publicar",
          variant: "primary"
        },
        {
          label: "Ver bicis destacadas",
          href: "#destacadas",
          variant: "secondary"
        }
      ]
    }
  },
  ctaGroups: [
    {
      id: "ventabici-contacto",
      label: "¿Querés vender con acompañamiento?",
      ctas: [
        {
          label: "Hablar por WhatsApp",
          href: "https://wa.me/5491111111111",
          variant: "ghost",
          openInNewTab: true
        }
      ]
    }
  ],
  sections: [
    {
      id: "como-funciona",
      kind: "content",
      title: "Cómo funciona Ventabici",
      description: "Un flujo breve para reducir fricción y mantener calidad comercial.",
      items: [
        "1. Cargás datos clave de la bici y fotos guiadas",
        "2. Validamos consistencia de la publicación",
        "3. Activamos difusión y seguimiento de interesados"
      ]
    },
    {
      id: "confianza",
      kind: "trust",
      title: "Por qué genera confianza",
      items: [
        {
          title: "Proceso visible",
          detail: "Cada publicación sigue la misma estructura editorial para evitar ruido."
        },
        {
          title: "Señales de calidad",
          detail: "Priorizamos datos verificables de uso, service y componentes."
        },
        {
          title: "Acompañamiento humano",
          detail:
            "El equipo comercial ayuda a ordenar dudas frecuentes antes de coordinar visitas."
        }
      ]
    },
    {
      id: "faq-inicial",
      kind: "faq",
      title: "Preguntas frecuentes",
      items: [
        {
          question: "¿Puedo publicar bicis usadas y nuevas?",
          answer:
            "Sí. El flujo admite ambos casos y adapta la narrativa comercial según estado y procedencia."
        },
        {
          question: "¿Ventabici compra bicicletas directamente?",
          answer:
            "En esta etapa priorizamos el modelo de intermediación comercial, no compra directa."
        },
        {
          question: "¿Cuánto tarda en salir publicada?",
          answer:
            "Con material completo, la publicación puede activarse el mismo día hábil."
        }
      ]
    }
  ]
};
