import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import PreviewBanner from "@/components/site/PreviewBanner";
import { getRenderedTheme } from "@/lib/appearance";
import { feedLinks } from "@/lib/metadata";
import { getPost, getPublishedPosts, neighbours, postPath } from "@/lib/posts";
import { getProfile } from "@/lib/profile";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { jsonLdScript, postJsonLd } from "@/lib/structuredData";
import { THEME_COMPONENTS } from "@/themes";

// Posts are rendered on their first request (the database isn't reachable
// during the build) and then cached until the post changes.
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams(): { slug: string }[] {
  return [];
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const [profile, post] = await Promise.all([getProfile(), getPost(slug, draft)]);
  if (!post) return {};

  const title = `${post.title} — ${profile.name}`;
  const description = post.excerpt ?? undefined;
  const url = `${SITE_URL}${postPath(post.slug)}`;
  return {
    title,
    description,
    alternates: { canonical: postPath(post.slug), types: feedLinks(profile.name, true) },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: post.title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
      authors: [SITE_URL],
      tags: post.tags ?? undefined,
    },
    twitter: { card: "summary_large_image", title: post.title, description },
    // A draft shown in preview should never be indexed.
    ...(draft ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const [profile, post, posts, theme] = await Promise.all([
    getProfile(),
    getPost(slug, draft),
    getPublishedPosts(),
    getRenderedTheme(),
  ]);
  if (!post) notFound();

  const { BlogPost } = THEME_COMPONENTS[theme.id];
  const { newer, older } = neighbours(posts, post.slug);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(postJsonLd(profile, post)) }} />
      <BlogPost profile={profile} post={post} posts={posts} newer={newer} older={older} />
      {theme.draft ? <PreviewBanner theme={theme.id} previewed={theme.previewed} draftPost /> : null}
    </>
  );
}
