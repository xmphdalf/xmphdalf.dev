import type { ComponentType } from "react";

import type { Profile } from "@/payload-types";

import type { ThemeId } from "./manifest";
import BoldTheme from "./bold";
import BoldNotFound from "./bold/NotFound";
import TerminalTheme from "./terminal";
import TerminalNotFound from "./terminal/NotFound";

export type ThemeComponents = {
  /** The home page. Receives the whole profile. */
  Page: ComponentType<{ profile: Profile }>;
  /** The 404 page. Optional; the default design's is used when missing. */
  NotFound?: ComponentType;
};

/**
 * One entry per design in the manifest; TypeScript fails the build if one is
 * missing. Each design's CSS only applies under its own data-site-theme, so
 * importing every design here is safe.
 */
export const THEME_COMPONENTS = {
  terminal: { Page: TerminalTheme, NotFound: TerminalNotFound },
  bold: { Page: BoldTheme, NotFound: BoldNotFound },
} satisfies Record<ThemeId, ThemeComponents>;
