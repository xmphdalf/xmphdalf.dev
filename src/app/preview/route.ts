import config from "@payload-config";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

import { PREVIEW_THEME_COOKIE } from "@/lib/appearance";
import { isThemeId } from "@/themes/manifest";

/**
 * GET /preview?design=<id>: shows the home page in any design, turned on or
 * not, for a logged-in admin only. Uses Draft Mode, so only this browser
 * skips the cache; everyone else keeps getting the cached page. Anyone else
 * gets a 404.
 */
export async function GET(request: Request): Promise<Response> {
  const design = new URL(request.url).searchParams.get("design");

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user || !isThemeId(design)) return new Response("Not found", { status: 404 });

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
