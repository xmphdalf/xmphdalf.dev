import { SITE_URL } from "@/lib/site";
import type { Profile } from "@/payload-types";

import type { NavLink } from "./Masthead";

export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** The profile links shown on the cover and at the close. */
export function profileLinks(profile: Profile): { label: string; url: string }[] {
  return [
    { label: "GitHub", url: profile.github },
    { label: "LinkedIn", url: profile.linkedin },
    { label: "Credly", url: profile.credly },
    {
      label: "Website",
      url: profile.website && profile.website.replace(/\/$/, "") !== SITE_URL ? profile.website : null,
    },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));
}

/** The home page's numbered sections, in page order. */
export function editorialSections(profile: Profile, hasPosts: boolean): NavLink[] {
  const skills = (profile.skills ?? []).filter((group) => group.items?.length);
  const hasContact = Boolean(profile.email) || profileLinks(profile).length > 0;
  return [
    ...(profile.experience?.length ? [{ id: "experience", label: "Experience" }] : []),
    ...(profile.clients?.length ? [{ id: "clients", label: "Client work" }] : []),
    ...(hasPosts ? [{ id: "writing", label: "Writing" }] : []),
    ...(skills.length ? [{ id: "stack", label: "Stack" }] : []),
    ...(profile.certifications?.length || profile.education?.length || profile.languages?.length
      ? [{ id: "credentials", label: "Credentials" }]
      : []),
    ...(hasContact ? [{ id: "contact", label: "Contact" }] : []),
  ];
}

/** The masthead on blog pages: sections link back home, Writing opens /blog. */
export function blogMasthead(profile: Profile, onIndex: boolean): NavLink[] {
  return editorialSections(profile, true)
    .filter((section) => section.id !== "contact")
    .map((section) =>
      section.id === "writing"
        ? { ...section, href: "/blog", current: onIndex }
        : { ...section, href: `/#${section.id}` },
    );
}
