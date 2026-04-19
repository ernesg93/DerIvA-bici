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
      id: "publicacion-pro",
      kind: "feature-grid",
      title: "Qué incluye una publicación comercial completa",
      description: "Cada aviso se estructura para acelerar decisiones y filtrar consultas de baja calidad.",
      items: [
        {
          badge: "Ficha técnica",
          title: "Especificaciones claras",
          description:
            "Cuadro, transmisión, rodado, kilometraje estimado y upgrades en un formato estándar fácil de comparar."
        },
        {
          badge: "Contenido visual",
          title: "Galería orientada a conversión",
          description:
            "Secuencia mínima recomendada de fotos para mostrar estado real, detalles de desgaste y puntos fuertes."
        },
        {
          badge: "Calificación comercial",
          title: "Precio con referencia de mercado",
          description:
            "Sugerimos un rango inicial basado en categoría y condición para evitar publicaciones fuera de mercado."
        },
        {
          badge: "Acompañamiento",
          title: "Pre-filtro de interesados",
          description:
            "Ordenamos preguntas frecuentes antes de derivar al vendedor para reducir tiempo perdido."
        }
      ]
    },
    {
      id: "casos-reales",
      kind: "social-proof",
      title: "Vendedores que cerraron con Ventabici",
      description: "Experiencias reales de usuarios que venían sin resultados en canales generalistas.",
      items: [
        {
          quote:
            "Tenía la bici publicada hacía semanas. Con una ficha mejor armada y fotos nuevas coordiné visita en 48 horas.",
          author: "Matías R.",
          role: "Vendedor particular",
          location: "CABA",
          outcome: "Venta cerrada en 6 días"
        },
        {
          quote:
            "Nos ayudaron a ordenar tres publicaciones del local y empezaron a entrar consultas mucho más concretas.",
          author: "Luciana F.",
          role: "Tienda multimarca",
          location: "Zona Norte",
          outcome: "2 bicis vendidas en la primera semana"
        },
        {
          quote:
            "Lo mejor fue el acompañamiento para negociar sin regalar la bici. Llegué al cierre con más seguridad.",
          author: "Nicolás P.",
          role: "Ciclista urbano",
          location: "La Plata",
          outcome: "Precio final dentro del rango recomendado"
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
