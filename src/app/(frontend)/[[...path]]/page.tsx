import { notFound } from "next/navigation";

import PreviewBanner from "@/components/site/PreviewBanner";
import { getRenderedTheme } from "@/lib/appearance";
import { getProfile } from "@/lib/profile";
import { jsonLdScript, profileJsonLd } from "@/lib/structuredData";
import { THEME_COMPONENTS } from "@/themes";

// The home page is rendered on its first request rather than at build time
// (the database isn't reachable during the build), then served from the
// cache. Saving the profile or the designs in the admin regenerates it; the
// daily revalidate is only a fallback.
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams(): { path?: string[] }[] {
  return [];
}

type PageProps = { params: Promise<{ path?: string[] }> };

export default async function Home({ params }: PageProps) {
  // Only the root path is a page; anything else is a 404.
  if ((await params).path?.length) notFound();

  const [profile, theme] = await Promise.all([getProfile(), getRenderedTheme()]);
  const { Page } = THEME_COMPONENTS[theme.id];

  // Structured data and the preview banner sit outside the design, so every
  // design gets them.
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(profileJsonLd(profile)) }} />
      <Page profile={profile} />
      {theme.draft ? <PreviewBanner theme={theme.id} previewed={theme.previewed} /> : null}
    </>
  );
}
