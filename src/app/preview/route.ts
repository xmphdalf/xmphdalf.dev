import config from "@payload-config";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

import { PREVIEW_THEME_COOKIE } from "@/lib/appearance";
import { postPath } from "@/lib/posts";
import { isThemeId } from "@/themes/manifest";

/**
 * Preview for a logged-in admin only. Uses Draft Mode, so only this browser
 * skips the cache; everyone else keeps getting the cached pages. Anyone else
 * gets a 404.
 *
 * - GET /preview?design=<id>: the home page in any design, turned on or not.
 * - GET /preview?post=<id>: a post's latest draft, in the live design (or the
 *   design already being previewed). This is the Preview button on a post.
 */
export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const design = params.get("design");
  const postId = params.get("post");

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return new Response("Not found", { status: 404 });

  if (postId) {
    const post = await payload
      .findByID({ collection: "posts", id: postId, draft: true, depth: 0, user, overrideAccess: false })
      .catch(() => null);
    if (!post?.slug) return new Response("Not found", { status: 404 });
    (await draftMode()).enable();
    redirect(postPath(post.slug));
  }

  if (!isThemeId(design)) return new Response("Not found", { status: 404 });

  (await cookies()).set(PREVIEW_THEME_COOKIE, design, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // A session cookie, like Draft Mode's own, so both end together.
  });
  (await draftMode()).enable();
  redirect("/");
}
