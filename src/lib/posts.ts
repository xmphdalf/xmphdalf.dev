import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";

import type { Media, Post } from "../payload-types";
import { POSTS_CACHE_TAG } from "./cacheTags";
import { asMedia } from "./profile";

export const BLOG_PATH = "/blog";
export const FEED_PATH = "/blog/feed.xml";
export const postPath = (slug: string) => `${BLOG_PATH}/${slug}`;

type Image = Media & { url: string };

/** What lists of posts need: everything but the body. */
export type PostSummary = Pick<Post, "id" | "title" | "slug" | "excerpt" | "publishedAt" | "updatedAt" | "tags"> & {
  readingMinutes: number | null;
  cover: Image | null;
};

/** A whole post, ready for a design to render. */
export type PostDetail = PostSummary & { content: Post["content"] };

const summarySelect = {
  title: true,
  slug: true,
  excerpt: true,
  publishedAt: true,
  updatedAt: true,
  tags: true,
  readingMinutes: true,
  cover: true,
} as const;

const toSummary = (doc: Partial<Post> & Pick<Post, "id" | "title" | "slug" | "updatedAt">): PostSummary => ({
  id: doc.id,
  title: doc.title,
  slug: doc.slug,
  excerpt: doc.excerpt ?? null,
  publishedAt: doc.publishedAt ?? null,
  updatedAt: doc.updatedAt,
  tags: doc.tags?.length ? doc.tags : null,
  readingMinutes: typeof doc.readingMinutes === "number" ? doc.readingMinutes : null,
  cover: asMedia(doc.cover),
});

/**
 * Every published post, newest first, without bodies. Cached until a post
 * is published, changed or unpublished (see hooks/revalidatePosts).
 */
export const getPublishedPosts = unstable_cache(
  async (): Promise<PostSummary[]> => {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      sort: "-publishedAt",
      depth: 1,
      pagination: false,
      select: summarySelect,
      overrideAccess: false,
    });
    return docs.map(toSummary);
  },
  ["posts"],
  { tags: [POSTS_CACHE_TAG] },
);

const findPost = async (slug: string, draft: boolean): Promise<PostDetail | null> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
    depth: 1,
    limit: 1,
    pagination: false,
    draft,
    // Drafts are only asked for in Draft Mode, which only a logged-in admin
    // can turn on (see app/preview). Visitors always go through access control.
    overrideAccess: draft,
  });
  const doc = docs[0];
  return doc ? { ...toSummary(doc), content: doc.content } : null;
};

const getPublishedPost = unstable_cache((slug: string) => findPost(slug, false), ["post"], {
  tags: [POSTS_CACHE_TAG],
});

/** One post by its address. In Draft Mode, the latest draft and never cached. */
export const getPost = (slug: string, draft = false): Promise<PostDetail | null> =>
  draft ? findPost(slug, true) : getPublishedPost(slug);

/** The published posts either side of this one, by date. */
export function neighbours(posts: PostSummary[], slug: string): { newer: PostSummary | null; older: PostSummary | null } {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { newer: null, older: null };
  return { newer: posts[index - 1] ?? null, older: posts[index + 1] ?? null };
}

/** Posts grouped by the year they were published, newest year first. */
export function postsByYear(posts: PostSummary[]): { year: number | null; posts: PostSummary[] }[] {
  const groups: { year: number | null; posts: PostSummary[] }[] = [];
  for (const post of posts) {
    const year = post.publishedAt ? new Date(post.publishedAt).getUTCFullYear() : null;
    const last = groups[groups.length - 1];
    if (last && last.year === year) last.posts.push(post);
    else groups.push({ year, posts: [post] });
  }
  return groups;
}

/** "6 min read", or nothing when unknown. */
export const readingLabel = (minutes: number | null, unit = "min read") => (minutes ? `${minutes} ${unit}` : null);
