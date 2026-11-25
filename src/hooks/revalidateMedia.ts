import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from "payload";

import { POSTS_CACHE_TAG, PROFILE_CACHE_TAG } from "../lib/cacheTags";

/**
 * The profile photo, résumé and post images are cached along with the
 * documents that use them, so replacing a file or editing its alt text
 * clears those caches too.
 */
async function revalidate(req: PayloadRequest) {
  if (req.context?.skipRevalidate) return;
  try {
    const { revalidatePath, revalidateTag } = await import("next/cache");
    revalidateTag(PROFILE_CACHE_TAG, { expire: 0 });
    revalidateTag(POSTS_CACHE_TAG, { expire: 0 });
    revalidatePath("/", "layout");
  } catch (error) {
    req.payload.logger.warn({ msg: "Could not revalidate the public site", err: error });
  }
}

export const revalidateMediaAfterChange: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  // A new upload isn't used anywhere yet.
  if (operation === "update") await revalidate(req);
  return doc;
};

export const revalidateMediaAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidate(req);
  return doc;
};
