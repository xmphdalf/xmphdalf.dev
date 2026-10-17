"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { applyColorScheme, currentColorScheme, savedColorScheme, type ColorScheme } from "@/lib/colorScheme";

export type NavLink = { id: string; label: string };

type Props = {
  name: string;
  sections: NavLink[];
  email?: string | null;
};

/** Re-renders when the html data-color-scheme attribute changes. */
const subscribeColorScheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-color-scheme"] });
  return () => observer.disconnect();
};

/** Sticky masthead: name, section links, email and the light/dark switch. */
export function Masthead({ name, sections, email }: Props) {
  const colorScheme = useSyncExternalStore(subscribeColorScheme, currentColorScheme, () => "light" as ColorScheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const dark = colorScheme === "dark";

  // Follow the system setting until the visitor picks light or dark.
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      if (!savedColorScheme()) applyColorScheme(event.matches ? "dark" : "light", false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const toggleColorScheme = useCallback(() => {
    applyColorScheme(currentColorScheme() === "dark" ? "light" : "dark", true);
  }, []);

  const hasNav = sections.length > 0 || Boolean(email);

  return (
    <header className="mast">
      <div className="mast-inner">
        <a className="wordmark" href="#top">
          {name}
        </a>
        <div className="mast-tools">
          {hasNav ? (
            <nav id="editorial-nav" className={menuOpen ? "nav open" : "nav"} aria-label="Sections">
              {sections.map(({ id, label }) => (
                <a key={id} className="u" href={`#${id}`} onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              ))}
              {email ? (
                <a className="u nav-cta" href={`mailto:${email}`}>
                  Email me
                </a>
              ) : null}
            </nav>
          ) : null}
          <button
            className="scheme-btn"
            type="button"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={dark}
            onClick={toggleColorScheme}
          >
            <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
            </svg>
            <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          </button>
          {hasNav ? (
            <button
              className="menu-btn"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="editorial-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="bars" aria-hidden="true" />
              <span className="sr-only">Menu</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
