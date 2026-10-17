/**
 * The site designs that exist in code. Plain data with no React or CSS
 * imports, so the Payload config can read it later for the admin options.
 */
export const THEMES = [{ id: "terminal", label: "Terminal" }] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: ThemeId = "terminal";
