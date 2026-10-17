import type { MetadataRoute } from "next";

import { getProfile } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";

// The database isn't reachable during the build, so this is generated on
// request. getProfile is cached and cleared on profile save, so this stays cheap.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const profile = await getProfile();
  return [{ url: SITE_URL, ...(profile.updatedAt ? { lastModified: new Date(profile.updatedAt) } : {}) }];
}
