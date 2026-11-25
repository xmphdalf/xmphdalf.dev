import type { MetadataRoute } from "next";

import { BLOG_PATH, getPublishedPosts, postPath } from "@/lib/posts";
import { getProfile } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";

// The database isn't reachable during the build, so this is generated on
// request. Both reads are cached and cleared on save, so this stays cheap.
export const dynamic = "force-dynamic";

const lastModified = (date?: string | null) => (date ? { lastModified: new Date(date) } : {});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [profile, posts] = await Promise.all([getProfile(), getPublishedPosts()]);
  const home = { url: SITE_URL, ...lastModified(profile.updatedAt) };
  if (!posts.length) return [home];

  return [
    home,
    { url: `${SITE_URL}${BLOG_PATH}`, ...lastModified(posts[0].updatedAt) },
    ...posts.map((post) => ({ url: `${SITE_URL}${postPath(post.slug)}`, ...lastModified(post.updatedAt) })),
  ];
}
