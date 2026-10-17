import type { Metadata } from "next";
import Image from "next/image";

import { SiteChrome, type SectionLink } from "@/components/site/SiteChrome";
import { displayUrl, formatMonthOrYear, formatSpan, paragraphs, slugify, startYearOf, summary } from "@/lib/format";
import { asMedia, getProfile } from "@/lib/profile";
import type { Profile } from "@/payload-types";

// Read at request time (the database isn't reachable during the build) and
// served from the data cache until the profile is saved in the admin.
export const dynamic = "force-dynamic";

const SITE_URL = "https://xmphdalf.dev";

const availabilityText: Record<Profile["availability"], string | null> = {
  roles: "open to roles",
  freelance: "open to freelance",
  both: "open to roles & freelance",
  notLooking: null,
};

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = profile.headline ? `${profile.name} — ${profile.headline}` : profile.name;
  const description = summary(profile.bio) ?? profile.headline ?? undefined;
  const photo = asMedia(profile.photo);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: "/" },
    icons: { icon: "/favicon.ico" },
    openGraph: {
      type: "profile",
      url: SITE_URL,
      siteName: "xmphdalf.dev",
      title,
      description,
      ...(photo ? { images: [{ url: photo.url, alt: photo.alt }] } : {}),
    },
    twitter: { card: "summary", title, description },
  };
}

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

function External({ href, className, children, label }: { href: string; className?: string; children: React.ReactNode; label?: string }) {
  return (
    <a className={className} href={href} {...newTab}>
      {children} ↗<span className="sr-only">{label ? ` ${label}` : ""} (opens in new tab)</span>
    </a>
  );
}

/** "English, Hindi (Fluent) · Gujarati (Native)" */
function languageLine(languages: NonNullable<Profile["languages"]>): string {
  const groups: { level: string; names: string[] }[] = [];
  for (const { language, level } of languages) {
    const key = level?.trim() ?? "";
    const last = groups[groups.length - 1];
    if (last && last.level === key) last.names.push(language);
    else groups.push({ level: key, names: [language] });
  }
  return groups.map((g) => `${g.names.join(", ")}${g.level ? ` (${g.level})` : ""}`).join(" · ");
}

export default async function Home() {
  const profile = await getProfile();

  const experience = profile.experience ?? [];
  const clients = profile.clients ?? [];
  const skills = (profile.skills ?? []).filter((group) => group.items?.length);
  const certifications = profile.certifications ?? [];
  const education = profile.education ?? [];
  const languages = profile.languages ?? [];
  const photo = asMedia(profile.photo);
  const resume = asMedia(profile.resume);
  const bio = paragraphs(profile.bio);

  const current = experience.find((role) => role.current) ?? experience[0];
  const companies = [...new Set(experience.map((role) => role.company))];
  const singleCompany = companies.length === 1 ? experience[0] : null;
  const firstYear = Math.min(...experience.map((role) => startYearOf(role) ?? Infinity));
  const status = availabilityText[profile.availability];

  const sections: SectionLink[] = [
    { id: "readme", file: "README.md" },
    ...(experience.length ? [{ id: "experience", file: "experience.log" }] : []),
    ...(clients.length ? [{ id: "clients", file: "client-work.md" }] : []),
    ...(skills.length ? [{ id: "stack", file: "stack.json" }] : []),
    ...(certifications.length || education.length || languages.length
      ? [{ id: "credentials", file: "credentials.md" }]
      : []),
    ...(profile.email || profile.github || profile.linkedin || profile.credly
      ? [{ id: "contact", file: "contact.sh" }]
      : []),
  ];
  const has = (id: string) => sections.some((section) => section.id === id);

  const companyLink = (role: { company: string; companyUrl?: string | null }) =>
    role.companyUrl ? (
      <a className="co" href={role.companyUrl} {...newTab}>
        {role.company}
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    ) : (
      role.company
    );

  const contactLinks = [
    { label: "github", url: profile.github },
    { label: "linkedin", url: profile.linkedin },
    { label: "credly", url: profile.credly },
    { label: "website", url: profile.website && profile.website !== "https://xmphdalf.dev" ? profile.website : null },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));

  return (
    <SiteChrome
      path={slugify(profile.name)}
      sections={sections}
      links={{
        email: profile.email,
        github: profile.github,
        linkedin: profile.linkedin,
        credly: profile.credly,
        resume: resume?.url,
      }}
    >
      <main id="main" className="main">
        <section id="readme" className="pane hero" aria-labelledby="readme-title">
          <p className="tab mono">README.md</p>
          {photo ? (
            <Image className="photo" src={photo.url} alt={photo.alt} width={144} height={144} priority />
          ) : null}
          {profile.headline ? <p className="mono muted">{profile.headline}</p> : null}
          <h1 id="readme-title">{profile.name}</h1>
          {bio.map((text) => (
            <p key={text} className="lede">
              {text}
            </p>
          ))}
          {profile.email || profile.github || profile.linkedin || profile.credly || resume ? (
            <div className="cta">
              {profile.email ? (
                <a className="btn" href={`mailto:${profile.email}`}>
                  Email me
                </a>
              ) : null}
              {profile.github ? <External className="ext mono" href={profile.github}>github</External> : null}
              {profile.linkedin ? <External className="ext mono" href={profile.linkedin}>linkedin</External> : null}
              {profile.credly ? <External className="ext mono" href={profile.credly}>credly</External> : null}
              {resume ? <External className="ext mono" href={resume.url}>resume</External> : null}
            </div>
          ) : null}
          {current || profile.location || status ? (
            <dl className="facts mono">
              {current ? (
                <div>
                  <dt>role</dt>
                  <dd>
                    {current.role} · {companyLink(current)}
                  </dd>
                </div>
              ) : null}
              {profile.location ? (
                <div>
                  <dt>location</dt>
                  <dd>{profile.location}</dd>
                </div>
              ) : null}
              {status ? (
                <div>
                  <dt>status</dt>
                  <dd>
                    <span className="dot" aria-hidden="true" />
                    {status}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </section>

        {has("experience") ? (
          <section id="experience" className="pane" aria-labelledby="experience-title">
            <p className="tab mono">experience.log</p>
            <h2 id="experience-title">Experience</h2>
            {singleCompany ? (
              <p className="muted">
                {companyLink(singleCompany)}
                {Number.isFinite(firstYear)
                  ? `, ${firstYear} — ${experience.some((role) => role.current) ? "present" : ""}`.replace(/ — $/, "")
                  : ""}
                {experience.length > 1
                  ? `. ${[...experience].reverse().map((role) => role.role).join(" → ")}.`
                  : "."}
              </p>
            ) : null}
            <ul className="log">
              {experience.map((role) => {
                const when = formatSpan(role);
                const highlights = role.highlights ?? [];
                return (
                  <li key={role.id ?? role.role}>
                    <span className="mono when">{when}</span>
                    <div>
                      <h3>{role.role}</h3>
                      {!singleCompany || role.location ? (
                        <p className="org mono">
                          {!singleCompany ? companyLink(role) : null}
                          {!singleCompany && role.location ? " · " : null}
                          {role.location}
                        </p>
                      ) : null}
                      {highlights.length ? (
                        <ul className="bul">
                          {highlights.map((item) => (
                            <li key={item.id ?? item.text}>{item.text}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {has("clients") ? (
          <section id="clients" className="pane" aria-labelledby="clients-title">
            <p className="tab mono">client-work.md</p>
            <h2 id="clients-title">Client work</h2>
            {singleCompany ? <p className="muted">via {companyLink(singleCompany)}</p> : null}
            <ul className="log">
              {clients.map((client) => (
                <li key={client.id ?? client.name}>
                  <span className="mono when">{client.years}</span>
                  <div>
                    <h3>
                      {client.url ? (
                        <a className="co" href={client.url} {...newTab}>
                          {client.name}
                          <span className="sr-only"> (opens in new tab)</span>
                        </a>
                      ) : (
                        client.name
                      )}
                    </h3>
                    {client.role ? <p className="org mono">{client.role}</p> : null}
                    {client.summary ? <p className="summary">{client.summary}</p> : null}
                    {client.tech?.length ? <p className="tags mono">{client.tech.join(" · ")}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {has("stack") ? (
          <section id="stack" className="pane" aria-labelledby="stack-title">
            <p className="tab mono">stack.json</p>
            <h2 id="stack-title">Stack</h2>
            <dl className="stack mono">
              {skills.map((group) => (
                <div key={group.id ?? group.group} className={group.group.trim().toLowerCase() === "also" ? "also" : undefined}>
                  <dt>{group.group.toLowerCase()}</dt>
                  <dd>{group.items!.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {has("credentials") ? (
          <section id="credentials" className="pane" aria-labelledby="credentials-title">
            <p className="tab mono">credentials.md</p>
            <h2 id="credentials-title">Credentials</h2>
            <div className="cols">
              {certifications.length ? (
                <div>
                  <h3 className="mono muted small">certifications</h3>
                  <ul className="plain certs">
                    {certifications.map((cert) => {
                      const issued = formatMonthOrYear(cert.issuedDate, cert.issuedYear);
                      return (
                        <li key={cert.id ?? cert.name}>
                          <span>
                            {cert.name}
                            {issued ? <span className="mono muted"> {issued}</span> : null}
                          </span>
                          {cert.credlyUrl ? (
                            <a className="verify mono" href={cert.credlyUrl} {...newTab}>
                              verify ↗<span className="sr-only"> {cert.name} on Credly (opens in new tab)</span>
                            </a>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
              {education.length || languages.length ? (
                <div>
                  {education.length ? (
                    <>
                      <h3 className="mono muted small">education</h3>
                      <ul className="plain">
                        {education.map((item) => {
                          const detail = [item.score, item.note].filter(Boolean).join(" · ");
                          return (
                            <li key={item.id ?? item.institution}>
                              <span>{[item.degree, item.institution].filter(Boolean).join(", ")}</span>
                              {detail ? <span className="mono muted">{detail}</span> : null}
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : null}
                  {languages.length ? (
                    <>
                      <h3 className="mono muted small">languages</h3>
                      <p>{languageLine(languages)}</p>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {has("contact") ? (
          <section id="contact" className="pane" aria-labelledby="contact-title">
            <p className="tab mono">contact.sh</p>
            <h2 id="contact-title">Contact</h2>
            {profile.email ? (
              <p className="mono prompt">
                <span className="muted">$</span> mail <a href={`mailto:${profile.email}`}>{profile.email}</a>
                <span className="caret" aria-hidden="true" />
              </p>
            ) : null}
            {contactLinks.length ? (
              <ul className="contact-links mono">
                {contactLinks.map((link) => (
                  <li key={link.label}>
                    <span className="muted">{link.label}</span>
                    <External href={link.url}>{displayUrl(link.url)}</External>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        <footer className="foot mono muted">
          © {new Date().getFullYear()} {profile.name}
        </footer>
      </main>
    </SiteChrome>
  );
}
