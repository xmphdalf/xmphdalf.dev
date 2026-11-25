import type { Profile } from "@/payload-types";

import type { SectionLink } from "./SiteChrome";

/**
 * The home page's sections as files in the tree, in page order. Shared by
 * the home page and the blog pages, so the tree is the same everywhere.
 */
export function terminalSections(profile: Profile, hasPosts: boolean): SectionLink[] {
  const skills = (profile.skills ?? []).filter((group) => group.items?.length);
  return [
    { id: "readme", file: "README.md" },
    ...(profile.experience?.length ? [{ id: "experience", file: "experience.log" }] : []),
    ...(profile.clients?.length ? [{ id: "clients", file: "client-work.md" }] : []),
    ...(hasPosts ? [{ id: "writing", file: "writing.log" }] : []),
    ...(skills.length ? [{ id: "stack", file: "stack.json" }] : []),
    ...(profile.certifications?.length || profile.education?.length || profile.languages?.length
      ? [{ id: "credentials", file: "credentials.md" }]
      : []),
    ...(profile.email || profile.github || profile.linkedin || profile.credly
      ? [{ id: "contact", file: "contact.sh" }]
      : []),
  ];
}

/** The links the header and command palette offer on every page. */
export const chromeLinks = (profile: Profile, resumeUrl?: string | null) => ({
  email: profile.email,
  github: profile.github,
  linkedin: profile.linkedin,
  credly: profile.credly,
  resume: resumeUrl,
});
