import type { Profile } from "../payload-types";
import { summary } from "./format";
import { asMedia } from "./profile";
import { SITE_NAME, SITE_URL } from "./site";

const absolute = (url: string) => new URL(url, SITE_URL).toString();
const compact = <T,>(items: (T | null | undefined | false | "")[]): T[] => items.filter(Boolean) as T[];

/**
 * schema.org ProfilePage + Person for the home page, built only from the
 * Profile so nothing about the owner is hard-coded.
 * https://developers.google.com/search/docs/appearance/structured-data/profile-page
 */
export function profileJsonLd(profile: Profile) {
  const experience = profile.experience ?? [];
  const current = experience.find((role) => role.current);
  const photo = asMedia(profile.photo);
  const personId = `${SITE_URL}/#person`;

  const sameAs = compact([
    profile.github,
    profile.linkedin,
    profile.credly,
    profile.website && profile.website.replace(/\/$/, "") !== SITE_URL ? profile.website : null,
  ]);

  const person = {
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    url: SITE_URL,
    jobTitle: current?.role ?? profile.headline ?? undefined,
    description: summary(profile.bio) ?? profile.headline ?? undefined,
    image: photo ? absolute(photo.url) : undefined,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    homeLocation: profile.location ? { "@type": "Place", name: profile.location } : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    worksFor: current
      ? { "@type": "Organization", name: current.company, url: current.companyUrl ?? undefined }
      : undefined,
    alumniOf: profile.education?.length
      ? profile.education.map((item) => ({ "@type": "EducationalOrganization", name: item.institution }))
      : undefined,
    knowsAbout: (() => {
      const skills = [...new Set((profile.skills ?? []).flatMap((group) => group.items ?? []))];
      return skills.length ? skills : undefined;
    })(),
    knowsLanguage: profile.languages?.length ? profile.languages.map((item) => item.language) : undefined,
    hasCredential: profile.certifications?.length
      ? profile.certifications.map((cert) => ({
          "@type": "EducationalOccupationalCredential",
          name: cert.name,
          url: cert.credlyUrl ?? undefined,
          recognizedBy: cert.issuer ? { "@type": "Organization", name: cert.issuer } : undefined,
        }))
      : undefined,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: profile.name,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        dateCreated: profile.createdAt ?? undefined,
        dateModified: profile.updatedAt ?? undefined,
        mainEntity: person,
      },
    ],
  };
}

/** Serialise for a <script> tag; escaping "<" stops content from closing the tag. */
export const jsonLdScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
