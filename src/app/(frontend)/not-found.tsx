import FallbackNotFound from "@/components/site/FallbackNotFound";
import { getRenderedTheme } from "@/lib/appearance";
import { getProfile } from "@/lib/profile";
import { THEME_COMPONENTS, type ThemeComponents } from "@/themes";

/**
 * The 404 page in the active design. Designs without their own 404 get a
 * plain, self-styled one instead of borrowing another design's.
 */
export default async function NotFound() {
  const { id } = await getRenderedTheme();
  const designs: Record<string, ThemeComponents> = THEME_COMPONENTS;
  const DesignNotFound = designs[id].NotFound;
  if (DesignNotFound) return <DesignNotFound />;

  const siteName = await getProfile().then((profile) => profile.name, () => null);
  return <FallbackNotFound siteName={siteName} />;
}
