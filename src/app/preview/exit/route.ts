import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { PREVIEW_THEME_COOKIE } from "@/lib/appearance";

/** Ends a design preview and goes back to the live home page. */
async function exitPreview(): Promise<Response> {
  (await draftMode()).disable();
  (await cookies()).delete(PREVIEW_THEME_COOKIE);
  redirect("/");
}

export const POST = exitPreview;
export const GET = exitPreview;
