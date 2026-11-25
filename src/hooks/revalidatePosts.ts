import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from "payload";

import { POSTS_CACHE_TAG } from "../lib/cacheTags";

type PostStatus = { _status?: "draft" | "published" | null };

/**
 * Clears the cached posts and the public pages, so the home page, the blog
 * and the feed all pick up the change. Same rules as hooks/revalidateSite.
 */
async function revalidatePublicSite(req: PayloadRequest) {
  if (req.context?.skipRevalidate) return;
  try {
    const { revalidatePath, revalidateTag } = await import("next/cache");
    revalidateTag(POSTS_CACHE_TAG, { expire: 0 });
    revalidatePath("/", "layout");
  } catch (error) {
    req.payload.logger.warn({ msg: "Could not revalidate the public site", err: error });
  }
}

/**
 * Only changes visitors can see clear the cache: publishing, editing a
 * published post, or unpublishing one. Saving a draft of a post that was
 * never published leaves the public site alone.
 */
export const revalidatePostAfterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const now = (doc as PostStatus)._status;
  const before = (previousDoc as PostStatus | undefined)?._status;
  if (now === "published" || before === "published") await revalidatePublicSite(req);
  return doc;
};

export const revalidatePostAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  if ((doc as PostStatus)._status === "published") await revalidatePublicSite(req);
  return doc;
};
