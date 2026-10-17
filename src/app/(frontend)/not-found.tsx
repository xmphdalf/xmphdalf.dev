import { getRenderedTheme } from "@/lib/appearance";
import { THEME_COMPONENTS, type ThemeComponents } from "@/themes";
import { DEFAULT_THEME } from "@/themes/manifest";

/** The 404 page in the active design, or the default design's if it has none. */
export default async function NotFound() {
  const { id } = await getRenderedTheme();
  const designs: Record<string, ThemeComponents> = THEME_COMPONENTS;
  const Component = designs[id].NotFound ?? designs[DEFAULT_THEME].NotFound;
  return Component ? <Component /> : null;
}
