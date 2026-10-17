import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { cookies, draftMode } from "next/headers";
import { getPayload } from "payload";

import { DEFAULT_THEME, isThemeId, type ThemeId } from "../themes/manifest";
import { APPEARANCE_CACHE_TAG } from "./cacheTags";

/** Set by /preview while an admin previews a design. Only read in Draft Mode. */
export const PREVIEW_THEME_COOKIE = "preview-design";

type AppearanceDoc = { activeTheme?: string | null; enabledThemes?: string[] | null };

/**
 * The saved Designs settings, cached until they are saved in the admin
 * (see hooks/revalidateSite).
 */
const getAppearance = unstable_cache(
  async (): Promise<AppearanceDoc> => {
    const payload = await getPayload({ config });
    return payload.findGlobal({ slug: "appearance", depth: 0, overrideAccess: false });
  },
  ["appearance"],
  { tags: [APPEARANCE_CACHE_TAG] },
);

/**
 * The design visitors see. Falls back to the default for anything that isn't
 * an enabled design in code, which also covers restored old versions (restores
 * skip validation) and designs removed from the code.
 */
export const resolveActiveTheme = (doc: AppearanceDoc | null | undefined): ThemeId => {
  const active = doc?.activeTheme;
  return isThemeId(active) && (doc?.enabledThemes ?? []).includes(active) ? active : DEFAULT_THEME;
};

export type RenderedTheme = {
  id: ThemeId;
  /** Draft Mode is on (an admin started a preview). Show the banner with Exit. */
  draft: boolean;
  /** The design came from the preview cookie rather than the saved settings. */
  previewed: boolean;
};

/**
 * The design to render for this request. Request data (the preview cookie)
 * is only read inside Draft Mode, which only admins can turn on, so the
 * public page stays static and cached. If the cookie is missing in Draft
 * Mode, the active design is shown and the banner still offers Exit.
 */
export async function getRenderedTheme(): Promise<RenderedTheme> {
  const draft = (await draftMode()).isEnabled;
  if (draft) {
    const previewed = (await cookies()).get(PREVIEW_THEME_COOKIE)?.value;
    if (isThemeId(previewed)) return { id: previewed, draft, previewed: true };
  }

  return { id: resolveActiveTheme(await getAppearance()), draft, previewed: false };
}
