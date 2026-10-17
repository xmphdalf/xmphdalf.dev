import type { GlobalAfterChangeHook } from "payload";

/**
 * Rebuilds the public pages after the profile is saved, so admin edits show
 * on the site straight away. Skipped outside a Next.js request (migrations,
 * scripts), where there is no page cache to clear.
 */
export const revalidateSite: GlobalAfterChangeHook = async ({ doc, req }) => {
  if (req.context?.skipRevalidate) return doc;

  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");
  } catch (error) {
    req.payload.logger.warn({ msg: "Could not revalidate the public site", err: error });
  }

  return doc;
};
