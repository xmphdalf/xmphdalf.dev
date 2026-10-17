import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";

import type { Media, Profile } from "../payload-types";
import { PROFILE_CACHE_TAG } from "./cacheTags";

/**
 * The public profile, read through the Local API. Cached until the profile
 * is saved in the admin (see hooks/revalidateSite).
 */
export const getProfile = unstable_cache(
  async (): Promise<Profile> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "profile", depth: 1, overrideAccess: false });
  },
  ["profile"],
  { tags: [PROFILE_CACHE_TAG] },
);

/** An upload field only counts when it was populated with a file URL. */
export const asMedia = (value: Profile["photo"]): (Media & { url: string }) | null =>
  value && typeof value === "object" && value.url ? (value as Media & { url: string }) : null;
