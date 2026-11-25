import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PreviewBanner from "@/components/site/PreviewBanner";
import { getRenderedTheme } from "@/lib/appearance";
import { feedLinks } from "@/lib/metadata";
import { BLOG_PATH, getPublishedPosts } from "@/lib/posts";
import { getProfile } from "@/lib/profile";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { blogJsonLd, jsonLdScript } from "@/lib/structuredData";
import { THEME_COMPONENTS } from "@/themes";

// Rendered on request: this is a static route, so without this Next would
// render it during the build, where the database isn't reachable. The posts
// come from the data cache (cleared on publish), so this stays cheap.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [profile, posts] = await Promise.all([getProfile(), getPublishedPosts()]);
  const title = `Blog — ${profile.name}`;
  const description = `Writing by ${profile.name}${profile.headline ? `, ${profile.headline}` : ""}.`;
  return {
    title,
    description,
    alternates: { canonical: BLOG_PATH, types: feedLinks(profile.name, posts.length > 0) },
    openGraph: { type: "website", url: `${SITE_URL}${BLOG_PATH}`, siteName: SITE_NAME, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPage() {
  const [profile, posts, theme] = await Promise.all([getProfile(), getPublishedPosts(), getRenderedTheme()]);
  // No published posts yet: there is no blog to show.
  if (!posts.length) notFound();

  const { BlogIndex } = THEME_COMPONENTS[theme.id];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(blogJsonLd(profile, posts)) }} />
      <BlogIndex profile={profile} posts={posts} />
      {theme.draft ? <PreviewBanner theme={theme.id} previewed={theme.previewed} /> : null}
    </>
  );
}
