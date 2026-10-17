"use client";

import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

import { CommandPalette, type Command } from "./CommandPalette";
import { applyTheme, currentTheme, savedTheme, type Theme } from "./theme";

export type SectionLink = { id: string; file: string };

export type ChromeLinks = {
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
  credly?: string | null;
  resume?: string | null;
};

type Props = {
  path: string;
  sections: SectionLink[];
  links: ChromeLinks;
  children: ReactNode;
};

/** Re-renders when the html data-theme attribute changes. */
const subscribeTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};

const noopSubscribe = () => () => {};

const shortcutLabel = () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K");

const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

export function SiteChrome({ path, sections, links, children }: Props) {
  const theme = useSyncExternalStore(subscribeTheme, currentTheme, () => "light" as Theme);
  const shortcut = useSyncExternalStore(noopSubscribe, shortcutLabel, () => "⌘K");
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null);

  // Follow the system setting until the visitor picks a theme.
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      if (!savedTheme()) applyTheme(event.matches ? "dark" : "light", false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
  }, []);

  // Cmd/Ctrl-K opens and closes the palette.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Highlight the section in view and draw its tab underline.
  useEffect(() => {
    const panes = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("seen");
          setActive(entry.target.id);
        }),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    const seen = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("seen")),
      { threshold: 0.2 },
    );
    panes.forEach((pane) => {
      spy.observe(pane);
      seen.observe(pane);
    });
    return () => {
      spy.disconnect();
      seen.disconnect();
    };
  }, [sections]);

  const commands: Command[] = [
    ...sections.map(({ id, file }) => ({
      label: file,
      hint: "go to",
      run: () => {
        location.hash = id;
      },
    })),
    ...(links.email
      ? [{ label: "Send email", hint: "action", run: () => (location.href = `mailto:${links.email}`) }]
      : []),
    ...(links.github ? [{ label: "Open GitHub", hint: "link", run: () => openExternal(links.github!) }] : []),
    ...(links.linkedin ? [{ label: "Open LinkedIn", hint: "link", run: () => openExternal(links.linkedin!) }] : []),
    ...(links.credly ? [{ label: "Open Credly", hint: "link", run: () => openExternal(links.credly!) }] : []),
    ...(links.resume ? [{ label: "Open resume", hint: "link", run: () => openExternal(links.resume!) }] : []),
    { label: "Toggle theme", hint: "action", run: toggleTheme },
    ...(links.email
      ? [
          {
            label: "Copy email address",
            hint: "action",
            run: () => void navigator.clipboard?.writeText(links.email!),
          },
        ]
      : []),
  ];

  const dark = theme === "dark";

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="app">
        <header className="top">
          <span className="mono path">~/{path}</span>
          <button
            className="kbd-btn"
            type="button"
            aria-haspopup="dialog"
            onClick={() => setPaletteOpen(true)}
          >
            <span className="label">Jump to…</span> <kbd>{shortcut}</kbd>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M20 20l-4.2-4.2" />
            </svg>
            <span className="sr-only"> Open command palette</span>
          </button>
          <button
            className="theme-btn"
            type="button"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            aria-pressed={dark}
            onClick={toggleTheme}
          >
            <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
            </svg>
            <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          </button>
          <button
            className="menu-btn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="tree"
            onClick={() => setMenuOpen((open) => !open)}
          >
            files
          </button>
        </header>

        <aside className={menuOpen ? "side open" : "side"}>
          <nav id="tree" className="tree mono" aria-label="Sections">
            <p className="tree-root">▾ portfolio/</p>
            {sections.map(({ id, file }) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {file}
              </a>
            ))}
          </nav>
          <p className="side-foot mono">
            Press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd>
            <br />
            to jump anywhere
          </p>
        </aside>

        {children}
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
    </>
  );
}
