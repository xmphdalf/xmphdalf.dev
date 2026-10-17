import type { Metadata, Viewport } from "next";
import type React from "react";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import { colorSchemeInitScript } from "@/lib/colorScheme";
import { summary } from "@/lib/format";
import { getProfile } from "@/lib/profile";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getRenderedTheme } from "@/lib/appearance";
import ThemeColorSync from "@/components/site/ThemeColorSync";
import { themeColorFor } from "@/themes/manifest";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Defined here, next to opengraph-image.tsx, so the generated image is used.
export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = profile.headline ? `${profile.name} — ${profile.headline}` : profile.name;
  const description = summary(profile.bio) ?? profile.headline ?? undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: "/" },
    icons: { icon: "/favicon.ico" },
    openGraph: {
      type: "profile",
      url: SITE_URL,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// The browser UI colour follows the design being shown and the light/dark mode.
export async function generateViewport(): Promise<Viewport> {
  const { id } = await getRenderedTheme();
  const { light, dark } = themeColorFor(id);
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: light },
      { media: "(prefers-color-scheme: dark)", color: dark },
    ],
  };
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  // The active design (or the one being previewed) scopes the design CSS.
  const { id: theme } = await getRenderedTheme();
  const themeColor = themeColorFor(theme);
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable}`}
      data-site-theme={theme}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorSchemeInitScript }} />
      </head>
      <body>
        {children}
        <ThemeColorSync light={themeColor.light} dark={themeColor.dark} />
      </body>
    </html>
  );
}
