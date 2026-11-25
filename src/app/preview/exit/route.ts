import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { PREVIEW_THEME_COOKIE } from "@/lib/appearance";

/** The page the banner was on, if it was on this site; otherwise the home page. */
function returnPath(request: Request): string {
  const referer = request.headers.get("referer");
  if (!referer) return "/";
  try {
    const from = new URL(referer);
    const self = new URL(request.url);
    if (from.host !== self.host || from.pathname.startsWith("/admin") || from.pathname.startsWith("/preview")) return "/";
    return from.pathname;
  } catch {
    return "/";
  }
}

/** Ends a preview and goes back to the live version of the same page. */
async function exitPreview(request: Request): Promise<Response> {
  (await draftMode()).disable();
  (await cookies()).delete(PREVIEW_THEME_COOKIE);
  redirect(returnPath(request));
}

export const POST = exitPreview;
export const GET = exitPreview;
