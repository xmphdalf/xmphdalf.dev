"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { applyColorScheme, currentColorScheme, savedColorScheme, type ColorScheme } from "@/lib/colorScheme";

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-color-scheme"] });
  return () => observer.disconnect();
};

/** Light/dark switch for the bold design. Follows the system until the visitor picks one. */
export function ColorSchemeToggle() {
  const scheme = useSyncExternalStore(subscribe, currentColorScheme, () => "light" as ColorScheme);

  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      if (!savedColorScheme()) applyColorScheme(event.matches ? "dark" : "light", false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    applyColorScheme(currentColorScheme() === "dark" ? "light" : "dark", true);
  }, []);

  const dark = scheme === "dark";
  return (
    <button
      type="button"
      className="toggle mono"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
    </button>
  );
}
