/**
 * The site designs that exist in code. Plain data with no React or CSS
 * imports, so the Payload config and admin components can read it.
 *
 * To add a design: add one entry here, one entry in ./index.ts, and a
 * thumbnail at public/designs/<id>.png. Ids are stored as text in the
 * database, so adding or removing a design never needs a migration.
 */
export const THEMES = [
  {
    id: "terminal",
    label: "Terminal",
    description: "Dark and light code-editor look with file tabs and a command palette.",
    thumbnail: "/designs/terminal.png",
  },
  {
    id: "bold",
    label: "Bold",
    description: "Oversized type and numbered sections, with its own light and dark.",
    thumbnail: "/designs/bold.png",
  },
  {
    id: "editorial",
    label: "Editorial",
    description: "Warm paper, serif headings with an italic accent, numbered sections and a career timeline.",
    thumbnail: "/designs/editorial.png",
  },
] as const satisfies readonly ThemeInfo[];

export type ThemeInfo = {
  /** Stored in the database and used as <html data-site-theme>. Never rename. */
  id: string;
  label: string;
  description: string;
  /** Path under public/, shown on the card in the admin. */
  thumbnail: string;
};

export type ThemeId = (typeof THEMES)[number]["id"];

/** Shown whenever the saved choice is missing, unknown or switched off. */
export const DEFAULT_THEME: ThemeId = "terminal";

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === "string" && THEMES.some((theme) => theme.id === value);
