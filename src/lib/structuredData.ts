import type { Profile } from "../payload-types";
import { summary } from "./format";
import { BLOG_PATH, postPath, type PostSummary } from "./posts";
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

/** The author as a short Person node, pointing at the full one on the home page. */
const authorNode = (profile: Profile) => ({ "@type": "Person", "@id": `${SITE_URL}/#person`, name: profile.name, url: SITE_URL });

/** schema.org Blog for the blog index, listing every published post. */
export function blogJsonLd(profile: Profile, posts: PostSummary[]) {
  const url = absolute(BLOG_PATH);
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name: `${profile.name} — Blog`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    author: authorNode(profile),
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absolute(postPath(post.slug)),
      datePublished: post.publishedAt ?? undefined,
      dateModified: post.updatedAt ?? undefined,
    })),
  };
}

/** schema.org BlogPosting for one post. */
export function postJsonLd(profile: Profile, post: PostSummary) {
  const url = absolute(postPath(post.slug));
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    url,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover ? absolute(post.cover.url) : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? undefined,
    keywords: post.tags?.length ? post.tags.join(", ") : undefined,
    timeRequired: post.readingMinutes ? `PT${post.readingMinutes}M` : undefined,
    author: authorNode(profile),
    publisher: authorNode(profile),
    isPartOf: { "@id": `${absolute(BLOG_PATH)}#blog` },
  };
}

/** Serialise for a <script> tag; escaping "<" stops content from closing the tag. */
export const jsonLdScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
