import type { Metadata } from "next";
import { getPlatformMetadata } from "@/src/core/seo/metadata";
import "./globals.css";

export const metadata: Metadata = getPlatformMetadata();

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
