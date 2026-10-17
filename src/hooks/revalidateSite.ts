import type { GlobalAfterChangeHook } from "payload";

import { APPEARANCE_CACHE_TAG, PROFILE_CACHE_TAG } from "../lib/cacheTags";

/**
 * Builds an afterChange hook that clears one cached global and the public
 * pages after it is saved (or a version is restored), so admin edits show on
 * the site straight away. Skipped outside a Next.js request (migrations,
 * scripts), where there is no cache to clear.
 */
const revalidateSiteFor =
  (tag: string): GlobalAfterChangeHook =>
  async ({ doc, req }) => {
    if (req.context?.skipRevalidate) return doc;

    try {
      const { revalidatePath, revalidateTag } = await import("next/cache");
      revalidateTag(tag, { expire: 0 });
      revalidatePath("/", "layout");
    } catch (error) {
      req.payload.logger.warn({ msg: "Could not revalidate the public site", err: error });
    }

    return doc;
  };

export const revalidateSite = revalidateSiteFor(PROFILE_CACHE_TAG);
export const revalidateAppearance = revalidateSiteFor(APPEARANCE_CACHE_TAG);
