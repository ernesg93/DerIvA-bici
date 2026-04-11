import type { Metadata } from "next";
import type { SeoDefinition } from "@/src/core/seo/types";

export function toMetadata(seo: SeoDefinition): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    openGraph: seo.openGraphImage
      ? {
          images: [seo.openGraphImage]
        }
      : undefined
  };
}
