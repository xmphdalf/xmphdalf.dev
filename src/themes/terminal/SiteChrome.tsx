"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

import { CommandPalette, type Command } from "./CommandPalette";
import { applyColorScheme, currentColorScheme, savedColorScheme, type ColorScheme } from "@/lib/colorScheme";

export type SectionLink = { id: string; file: string };

export type ChromeLinks = {
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
  credly?: string | null;
  resume?: string | null;
};

/** A post as a file in the tree. */
export type PostFile = { slug: string; title: string };

/** Which blog page is open, if any. */
export type BlogLocation = { page: "index" } | { page: "post"; slug: string };

type Props = {
  path: string;
  /** The home page's sections. */
  sections: SectionLink[];
  /** Published posts, newest first. The tree shows the latest few. */
  posts?: PostFile[];
  /** Set on blog pages; section links then point back to the home page. */
  blog?: BlogLocation;
  links: ChromeLinks;
  children: ReactNode;
};

/** How many posts the tree lists before "all posts". */
const TREE_POSTS = 6;

/** Re-renders when the html data-color-scheme attribute changes. */
const subscribeColorScheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-color-scheme"] });
  return () => observer.disconnect();
};

const noopSubscribe = () => () => {};

const shortcutLabel = () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K");

const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

const postHref = (slug: string) => `/blog/${slug}`;

export function SiteChrome({ path, sections, posts = [], blog, links, children }: Props) {
  const colorScheme = useSyncExternalStore(subscribeColorScheme, currentColorScheme, () => "light" as ColorScheme);
  const shortcut = useSyncExternalStore(noopSubscribe, shortcutLabel, () => "⌘K");
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const onHome = !blog;
  const [active, setActive] = useState<string | null>(onHome ? (sections[0]?.id ?? null) : null);

  const sectionHref = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const currentSlug = blog?.page === "post" ? blog.slug : null;

  // Follow the system setting until the visitor picks light or dark.
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      if (!savedColorScheme()) applyColorScheme(event.matches ? "dark" : "light", false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggleColorScheme = useCallback(() => {
    applyColorScheme(currentColorScheme() === "dark" ? "light" : "dark", true);
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

  // Highlight the section in view and draw its tab underline. Blog pages
  // have no sections to follow, but their panes still draw the underline.
  useEffect(() => {
    const panes = [...document.querySelectorAll<HTMLElement>("#main .pane")];

    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("seen");
          if (sections.some((section) => section.id === entry.target.id)) setActive(entry.target.id);
        }),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    const seen = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("seen")),
      { threshold: 0.2 },
    );
    panes.forEach((pane) => {
      if (onHome) spy.observe(pane);
      seen.observe(pane);
    });
    return () => {
      spy.disconnect();
      seen.disconnect();
    };
  }, [sections, onHome]);

  const go = (href: string) => () => {
    location.href = href;
  };

  const commands: Command[] = [
    ...sections.map(({ id, file }) => ({ label: file, hint: "go to", run: go(sectionHref(id)) })),
    ...(posts.length ? [{ label: "blog/", hint: "all posts", run: go("/blog") }] : []),
    ...posts.map((post) => ({ label: `${post.slug}.md`, hint: "post", keywords: post.title, run: go(postHref(post.slug)) })),
    ...(links.email
      ? [{ label: "Send email", hint: "action", run: () => (location.href = `mailto:${links.email}`) }]
      : []),
    ...(links.github ? [{ label: "Open GitHub", hint: "link", run: () => openExternal(links.github!) }] : []),
    ...(links.linkedin ? [{ label: "Open LinkedIn", hint: "link", run: () => openExternal(links.linkedin!) }] : []),
    ...(links.credly ? [{ label: "Open Credly", hint: "link", run: () => openExternal(links.credly!) }] : []),
    ...(links.resume ? [{ label: "Open resume", hint: "link", run: () => openExternal(links.resume!) }] : []),
    ...(posts.length ? [{ label: "Open RSS feed", hint: "link", run: go("/blog/feed.xml") }] : []),
    { label: "Toggle light/dark mode", hint: "action", run: toggleColorScheme },
    ...(blog
      ? [{ label: "Copy link to this page", hint: "action", run: () => void navigator.clipboard?.writeText(location.href) }]
      : []),
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

  const dark = colorScheme === "dark";

  // Keep the open post in the tree even when it's older than the latest few.
  const treePosts = posts.slice(0, TREE_POSTS);
  const openPost = currentSlug ? posts.find((post) => post.slug === currentSlug) : undefined;
  if (openPost && !treePosts.includes(openPost)) treePosts.push(openPost);
  const hidden = posts.length - treePosts.length;

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="app">
        <header className="top">
          <Link className="mono path" href="/">
            ~/{path}
          </Link>
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
            className="scheme-btn"
            type="button"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={dark}
            onClick={toggleColorScheme}
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
          <nav id="tree" className="tree mono" aria-label="Site">
            <p className="tree-root">▾ portfolio/</p>
            {sections.map(({ id, file }) => (
              <a
                key={id}
                href={sectionHref(id)}
                aria-current={onHome && active === id ? "true" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {file}
              </a>
            ))}
            {posts.length ? (
              <>
                <Link
                  className="tree-dir"
                  href="/blog"
                  aria-current={blog?.page === "index" ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {blog ? "▾" : "▸"} blog/
                </Link>
                {treePosts.map((post) => (
                  <Link
                    key={post.slug}
                    className="tree-file"
                    href={postHref(post.slug)}
                    title={post.title}
                    aria-current={post.slug === currentSlug ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {post.slug}.md
                  </Link>
                ))}
                {hidden > 0 ? (
                  <Link className="tree-file tree-more" href="/blog" onClick={() => setMenuOpen(false)}>
                    … {hidden} more
                  </Link>
                ) : null}
              </>
            ) : null}
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
