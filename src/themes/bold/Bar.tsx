import { asMedia } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";
import type { Profile } from "@/payload-types";

import { ColorSchemeToggle } from "./ColorSchemeToggle";

export type BoldSection = { id: string; label: string };

const availabilityText: Record<Profile["availability"], string | null> = {
  roles: "Open to roles",
  freelance: "Open to freelance",
  both: "Open to roles & freelance",
  notLooking: null,
};

export const boldStatus = (profile: Profile) => availabilityText[profile.availability];

/** Same test as the home page's contact links (a website pointing here doesn't count). */
export const hasContactLinks = (profile: Profile) =>
  Boolean(
    profile.github ||
      profile.linkedin ||
      profile.credly ||
      asMedia(profile.resume) ||
      (profile.website && profile.website.replace(/\/$/, "") !== SITE_URL),
  );

/**
 * The home page's numbered sections, in page order. Shared with the blog
 * pages so the bar and its numbers match everywhere.
 */
export function boldSections(profile: Profile, hasPosts: boolean, withContactLinks: boolean): BoldSection[] {
  const skills = (profile.skills ?? []).filter((group) => group.items?.length);
  return [
    ...(profile.experience?.length ? [{ id: "experience", label: "Experience" }] : []),
    ...(profile.clients?.length ? [{ id: "clients", label: "Client work" }] : []),
    ...(hasPosts ? [{ id: "writing", label: "Writing" }] : []),
    ...(skills.length ? [{ id: "stack", label: "Stack" }] : []),
    ...(profile.certifications?.length || profile.education?.length || profile.languages?.length
      ? [{ id: "credentials", label: "Credentials" }]
      : []),
    ...(profile.email || withContactLinks ? [{ id: "contact", label: "Contact" }] : []),
  ];
}

export const sectionNumber = (sections: BoldSection[], id: string) =>
  String(sections.findIndex((section) => section.id === id) + 1).padStart(2, "0");

type Props = {
  profile: Profile;
  sections: BoldSection[];
  /** Set on blog pages: links go back to the home page, and Writing opens /blog. */
  onBlog?: boolean;
};

/** The sticky top bar: mark, numbered sections, status and light/dark. */
export function Bar({ profile, sections, onBlog = false }: Props) {
  const status = boldStatus(profile);
  const first = profile.name.trim().split(/\s+/)[0];
  const href = (id: string) => {
    if (id === "writing" && onBlog) return "/blog";
    return onBlog ? `/#${id}` : `#${id}`;
  };

  return (
    <header className="bar">
      <a className="mark" href={onBlog ? "/" : "#top"}>
        {first}
        <span>.</span>
      </a>
      {sections.length ? (
        <nav className="nav" aria-label="Sections">
          {sections.map((section) => (
            <a
              key={section.id}
              href={href(section.id)}
              aria-current={onBlog && section.id === "writing" ? "page" : undefined}
            >
              <i>{sectionNumber(sections, section.id)}</i>
              {section.label}
            </a>
          ))}
        </nav>
      ) : null}
      {status ? (
        <p className="status mono">
          <b aria-hidden="true" />
          {status}
        </p>
      ) : null}
      <ColorSchemeToggle />
    </header>
  );
}
