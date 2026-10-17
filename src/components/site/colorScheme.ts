/**
 * The visitor's light/dark preference. Kept separate from site designs,
 * which are chosen in the admin.
 */
export type ColorScheme = "light" | "dark";

export const COLOR_SCHEME_STORAGE_KEY = "color-scheme";

/** Key used before the rename; read once so saved choices carry over. */
const LEGACY_STORAGE_KEY = "theme";

/**
 * Runs before first paint (inlined in <head>) so the saved or system scheme
 * is applied without a flash.
 */
export const colorSchemeInitScript = `(function(){var t;try{t=localStorage.getItem("${COLOR_SCHEME_STORAGE_KEY}")||localStorage.getItem("${LEGACY_STORAGE_KEY}")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.colorScheme=t})()`;

export const currentColorScheme = (): ColorScheme =>
  document.documentElement.dataset.colorScheme === "dark" ? "dark" : "light";

export const applyColorScheme = (scheme: ColorScheme, persist: boolean) => {
  document.documentElement.dataset.colorScheme = scheme;
  if (!persist) return;
  try {
    localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, scheme);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode); the scheme still applies.
  }
};

export const savedColorScheme = (): ColorScheme | null => {
  try {
    const value = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
};
