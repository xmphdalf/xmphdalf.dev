"use client";

import { useEffect } from "react";

import { applyColorScheme, savedColorScheme } from "@/lib/colorScheme";

/**
 * The inline script in the layout doesn't run when a page is rendered in the
 * browser (such as the 404), so apply the saved or system scheme here.
 */
export default function ApplyColorScheme() {
  useEffect(() => {
    const system = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyColorScheme(savedColorScheme() ?? system, false);
  }, []);
  return null;
}
