import type { GlobalAfterChangeHook } from "payload";

import { PROFILE_CACHE_TAG } from "../lib/cacheTags";

/**
 * Clears the cached profile after it is saved, so admin edits show on the
 * site straight away. Skipped outside a Next.js request (migrations,
 * scripts), where there is no cache to clear.
 */
export const revalidateSite: GlobalAfterChangeHook = async ({ doc, req }) => {
  if (req.context?.skipRevalidate) return doc;

  try {
    const { revalidatePath, revalidateTag } = await import("next/cache");
    revalidateTag(PROFILE_CACHE_TAG, { expire: 0 });
    revalidatePath("/", "layout");
  } catch (error) {
    req.payload.logger.warn({ msg: "Could not revalidate the public site", err: error });
  }

  return doc;
};
