import { BLOG_PATH, FEED_PATH, getPublishedPosts, postPath } from "@/lib/posts";
import { getProfile } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";

// Built on request like the sitemap; both reads come from the data cache.
export const dynamic = "force-dynamic";

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const rfc822 = (date?: string | null) => (date ? new Date(date).toUTCString() : null);

/** RSS 2.0 feed of published posts, newest first. */
export async function GET(): Promise<Response> {
  const [profile, posts] = await Promise.all([getProfile(), getPublishedPosts()]);
  if (!posts.length) return new Response("Not found", { status: 404 });

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}${postPath(post.slug)}`;
      const date = rfc822(post.publishedAt);
      return [
        "    <item>",
        `      <title>${escape(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        date ? `      <pubDate>${date}</pubDate>` : null,
        post.excerpt ? `      <description>${escape(post.excerpt)}</description>` : null,
        ...(post.tags ?? []).map((tag) => `      <category>${escape(tag)}</category>`),
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const title = `${profile.name} — Blog`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(title)}</title>
    <link>${SITE_URL}${BLOG_PATH}</link>
    <description>${escape(`Writing by ${profile.name}.`)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}${FEED_PATH}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${rfc822(posts.map((post) => post.updatedAt).sort().at(-1))}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
