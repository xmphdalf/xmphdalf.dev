"use client";

import { useEffect } from "react";

import { currentColorScheme } from "@/lib/colorScheme";
import type { ThemeColor } from "@/themes/manifest";

/**
 * The theme-color tags in the layout follow the system light/dark setting.
 * Visitors can pick a mode that differs from it, so once the page runs, this
 * adds one tag ahead of them for the mode actually shown and keeps it in step
 * with the toggle (data-color-scheme on <html>).
 */
export default function ThemeColorSync({ light, dark }: ThemeColor) {
  useEffect(() => {
    const root = document.documentElement;
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    const update = () => {
      meta.content = currentColorScheme() === "dark" ? dark : light;
    };
    update();
    // Browsers use the first matching tag, so this one must come first.
    document.head.prepend(meta);

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["data-color-scheme"] });
    return () => {
      observer.disconnect();
      meta.remove();
    };
  }, [light, dark]);

  return null;
}
