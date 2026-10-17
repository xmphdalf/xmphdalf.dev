import type { Metadata } from "next";
import type React from "react";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import { themeInitScript } from "@/components/site/theme";
import { summary } from "@/lib/format";
import { getProfile } from "@/lib/profile";

import "./site.css";

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

const SITE_URL = "https://xmphdalf.dev";

// Site-wide metadata, read from the profile.
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
      siteName: "xmphdalf.dev",
      title,
      description,
    },
    twitter: { card: "summary", title, description },
  };
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#1f1f1d" },
  ],
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
