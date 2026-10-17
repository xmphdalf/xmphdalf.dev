import { type GlobalBeforeValidateHook, ValidationError } from "payload";

import { isThemeId, THEMES } from "../themes/manifest";

type AppearanceData = { activeTheme?: string | null; enabledThemes?: string[] | null };

/**
 * Checks the Designs settings against the designs in code. On update `data`
 * only holds the changed fields, so it is merged over the saved document
 * first. Version restores skip this hook; the frontend falls back to the
 * default design for anything invalid.
 */
export const validateAppearance: GlobalBeforeValidateHook = ({ data, originalDoc, req }) => {
  const merged: AppearanceData = { ...(originalDoc as AppearanceData), ...(data as AppearanceData) };
  const enabled = [...new Set(merged.enabledThemes ?? [])];
  const active = merged.activeTheme ?? "";
  const known = THEMES.map((theme) => theme.id).join(", ");
  const errors: { message: string; path: string }[] = [];

  const unknown = enabled.filter((id) => !isThemeId(id));
  if (unknown.length) {
    errors.push({ path: "enabledThemes", message: `Unknown design: ${unknown.join(", ")}. Designs in code: ${known}.` });
  }
  if (!enabled.some(isThemeId)) {
    errors.push({ path: "enabledThemes", message: "Turn on at least one design." });
  }
  if (!isThemeId(active)) {
    errors.push({ path: "activeTheme", message: `Unknown design: "${active}". Designs in code: ${known}.` });
  } else if (!enabled.includes(active)) {
    errors.push({ path: "activeTheme", message: "The active design must be turned on." });
  }

  if (errors.length) throw new ValidationError({ global: "appearance", errors, req });

  // Store each enabled design once.
  return data && "enabledThemes" in data ? { ...data, enabledThemes: enabled } : data;
};
