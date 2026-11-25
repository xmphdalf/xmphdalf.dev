import { notFound } from "next/navigation";

import { formatDay, slugify } from "@/lib/format";
import { OG_SIZE, renderOgImage } from "@/lib/ogImage";
import { getPost, readingLabel } from "@/lib/posts";
import { getProfile } from "@/lib/profile";

export const alt = "Blog post on xmphdalf.dev";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-dynamic";

/** The link-preview card for one published post. */
export default async function PostOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [profile, post] = await Promise.all([getProfile(), getPost(slug)]);
  if (!post) notFound();

  return renderOgImage({
    path: `~/${slugify(profile.name)}/blog`,
    tab: `${post.slug}.md`,
    kicker: [formatDay(post.publishedAt), readingLabel(post.readingMinutes)].filter(Boolean).join(" · "),
    title: post.title,
  });
}
