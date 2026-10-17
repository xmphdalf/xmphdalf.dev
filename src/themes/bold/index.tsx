import Image from "next/image";

import {
  displayUrl,
  endYearOf,
  formatMonthOrYear,
  formatRange,
  formatSpan,
  normalizeRange,
  ONGOING,
  paragraphs,
  startYearOf,
} from "@/lib/format";
import { asMedia } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";
import type { Profile } from "@/payload-types";

import { ColorSchemeToggle } from "./ColorSchemeToggle";
import { fontVariables } from "./fonts";
import "./bold.css";

const availabilityText: Record<Profile["availability"], string | null> = {
  roles: "Open to roles",
  freelance: "Open to freelance",
  both: "Open to roles & freelance",
  notLooking: null,
};

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

function External({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a className={className} href={href} {...newTab}>
      {children} ↗<span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}

function OrgLink({ name, url }: { name: string; url?: string | null }) {
  return url ? (
    <a className="org-link" href={url} {...newTab}>
      {name}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  ) : (
    <>{name}</>
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

/** Splits "First Middle Last" so the last word can be set in the accent serif. */
function splitName(name: string): { lead: string; last: string | null } {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return { lead: name.trim(), last: null };
  return { lead: words.slice(0, -1).join(" "), last: words[words.length - 1] };
}

type Section = { id: string; label: string };

/** The bold design: oversized type, numbered sections, one accent colour. */
export default function BoldTheme({ profile }: { profile: Profile }) {
  const experience = profile.experience ?? [];
  const clients = profile.clients ?? [];
  const skills = (profile.skills ?? []).filter((group) => group.items?.length);
  const certifications = profile.certifications ?? [];
  const education = profile.education ?? [];
  const languages = profile.languages ?? [];
  const photo = asMedia(profile.photo);
  const resume = asMedia(profile.resume);
  const bio = paragraphs(profile.bio);
  const status = availabilityText[profile.availability];
  const { lead, last } = splitName(profile.name);

  const current = experience.find((role) => role.current) ?? experience[0];
  const companies = [...new Set(experience.map((role) => role.company))];
  const singleCompany = companies.length === 1 ? experience[0] : null;
  const firstYear = Math.min(...experience.map((role) => startYearOf(role) ?? Infinity));
  const lastYear = Math.max(...experience.map((role) => endYearOf(role) ?? -Infinity));
  const careerSpan = formatRange(
    Number.isFinite(firstYear) ? String(firstYear) : null,
    experience.some((role) => role.current) ? ONGOING : Number.isFinite(lastYear) ? String(lastYear) : null,
  );

  const contactLinks = [
    { label: "GitHub", url: profile.github },
    { label: "LinkedIn", url: profile.linkedin },
    { label: "Credly", url: profile.credly },
    {
      label: "Website",
      url: profile.website && profile.website.replace(/\/$/, "") !== SITE_URL ? profile.website : null,
    },
    { label: "Résumé", url: resume?.url },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));

  const sections: Section[] = [
    ...(experience.length ? [{ id: "experience", label: "Experience" }] : []),
    ...(clients.length ? [{ id: "clients", label: "Client work" }] : []),
    ...(skills.length ? [{ id: "stack", label: "Stack" }] : []),
    ...(certifications.length || education.length || languages.length
      ? [{ id: "credentials", label: "Credentials" }]
      : []),
    ...(profile.email || contactLinks.length ? [{ id: "contact", label: "Contact" }] : []),
  ];
  const number = (id: string) => String(sections.findIndex((section) => section.id === id) + 1).padStart(2, "0");
  const has = (id: string) => sections.some((section) => section.id === id);

  const sectionHead = (id: string, label: string, note?: React.ReactNode) => (
    <header className="stage-head grid">
      <span className="num" aria-hidden="true">
        {number(id)}
      </span>
      <h2 id={`${id}-title`}>
        {label}
        <span className="dot">.</span>
      </h2>
      {note ? <p className="stage-note mono dim">{note}</p> : null}
    </header>
  );

  return (
    <div className={`bold-root ${fontVariables}`}>
      <a className="skip mono" href="#main">
        Skip to content
      </a>

      <header className="bar">
        <a className="mark" href="#top">
          {lead.split(/\s+/)[0]}
          <span>.</span>
        </a>
        {sections.length ? (
          <nav className="nav" aria-label="Sections">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                <i>{number(section.id)}</i>
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

      <main id="main">
        <section id="top" className="hero grid" aria-labelledby="hero-title">
          <div className="hero-meta mono">
            {profile.location ? <p className="dim">{profile.location}</p> : null}
            {current ? (
              // The headline usually names the role already, so only repeat it when there's no headline.
              <p>
                {profile.headline ? null : (
                  <>
                    {current.role}
                    <br />
                  </>
                )}
                <span className="dim">
                  {profile.headline ? "Now at " : "at "}
                  <OrgLink name={current.company} url={current.companyUrl} />
                </span>
              </p>
            ) : null}
          </div>

          <h1 id="hero-title" className="hero-name">
            <span className="lead">{lead}</span>
            {last ? (
              <>
                {" "}
                <em>{last}</em>
              </>
            ) : null}
          </h1>

          {profile.headline ? <p className="hero-title mono">{profile.headline}</p> : null}

          <div className="hero-out">
            {photo ? (
              <Image className="photo" src={photo.url} alt={photo.alt} width={112} height={112} priority />
            ) : null}
            {bio.map((text) => (
              <p key={text} className="lede">
                {text}
              </p>
            ))}
            {profile.email || contactLinks.length ? (
              <div className="hero-cta">
                {profile.email ? (
                  <a className="btn" href={`mailto:${profile.email}`}>
                    Email me →
                  </a>
                ) : null}
                {contactLinks.map((link) => (
                  <External key={link.label} className="link" href={link.url}>
                    {link.label}
                  </External>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {has("experience") ? (
          <section id="experience" className="stage" aria-labelledby="experience-title">
            {sectionHead("experience", "Experience")}
            <div className="grid">
              {singleCompany ? (
                <aside className="co">
                  <h3>
                    <OrgLink name={singleCompany.company} url={singleCompany.companyUrl} />
                  </h3>
                  {careerSpan ? <p className="mono dim">{careerSpan}</p> : null}
                  {experience.length > 1 ? (
                    <ol className="ladder mono" aria-label="Roles, earliest first">
                      {[...experience].reverse().map((role) => (
                        <li key={role.id ?? role.role} className={role === current ? "now" : undefined}>
                          {role.role}
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </aside>
              ) : null}
              <div className={singleCompany ? "roles" : "roles wide"}>
                {experience.map((role) => {
                  const when = formatSpan(role);
                  const highlights = role.highlights ?? [];
                  return (
                    <article key={role.id ?? role.role} className="role">
                      <div className="role-h">
                        <h3>{role.role}</h3>
                        {when ? <span className="mono dim">{when}</span> : null}
                      </div>
                      {!singleCompany || role.location ? (
                        <p className="mono dim org">
                          {!singleCompany ? <OrgLink name={role.company} url={role.companyUrl} /> : null}
                          {!singleCompany && role.location ? " · " : null}
                          {role.location}
                        </p>
                      ) : null}
                      {highlights.length ? (
                        <ul>
                          {highlights.map((item) => (
                            <li key={item.id ?? item.text}>{item.text}</li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {has("clients") ? (
          <section id="clients" className="stage" aria-labelledby="clients-title">
            {sectionHead(
              "clients",
              "Client work",
              singleCompany ? (
                <>
                  via <OrgLink name={singleCompany.company} url={singleCompany.companyUrl} />
                </>
              ) : null,
            )}
            <ul className="clients grid">
              {clients.map((client) => (
                <li key={client.id ?? client.name} className="client">
                  <div className="client-h">
                    <h3>
                      <OrgLink name={client.name} url={client.url} />
                    </h3>
                    {client.years ? <span className="mono dim">{normalizeRange(client.years)}</span> : null}
                  </div>
                  {client.role ? <p className="mono dim">{client.role}</p> : null}
                  {client.summary ? <p className="summary">{client.summary}</p> : null}
                  {client.tech?.length ? (
                    <ul className="tags mono" aria-label="Technologies">
                      {client.tech.map((tech) => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {has("stack") ? (
          <section id="stack" className="stage ink" aria-labelledby="stack-title">
            {sectionHead("stack", "Stack")}
            <div className="clusters grid">
              {skills.map((group) => (
                <div key={group.id ?? group.group} className="cluster">
                  <h3 className="mono">[{group.group}]</h3>
                  <ul>
                    {group.items!.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {has("credentials") ? (
          <section id="credentials" className="stage" aria-labelledby="credentials-title">
            {sectionHead("credentials", "Credentials")}
            <div className="creds grid">
              {certifications.length ? (
                <div className="certs">
                  <h3 className="mono dim">Certifications</h3>
                  <ol>
                    {certifications.map((cert, index) => {
                      const issued = formatMonthOrYear(cert.issuedDate, cert.issuedYear);
                      return (
                        <li key={cert.id ?? cert.name}>
                          <span className="mono dim idx">{String(index + 1).padStart(2, "0")}</span>
                          <div>
                            <p className="cert-name">{cert.name}</p>
                            {cert.issuer ? <p className="mono dim">{cert.issuer}</p> : null}
                          </div>
                          <div className="cert-meta mono">
                            {issued ? <span className="dim">{issued}</span> : null}
                            {cert.credlyUrl ? (
                              <a href={cert.credlyUrl} {...newTab}>
                                Verify ↗<span className="sr-only"> {cert.name} on Credly (opens in new tab)</span>
                              </a>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ) : null}
              {education.length || languages.length ? (
                <div className="edu">
                  {education.length ? (
                    <>
                      <h3 className="mono dim">Education</h3>
                      <ul>
                        {education.map((item) => {
                          const detail = [item.score, item.note].filter(Boolean).join(" · ");
                          return (
                            <li key={item.id ?? item.institution}>
                              {item.degree ? <p className="degree">{item.degree}</p> : null}
                              <p className="mono dim">{item.institution}</p>
                              {detail ? <p className="mono">{detail}</p> : null}
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : null}
                  {languages.length ? (
                    <>
                      <h3 className="mono dim">Languages</h3>
                      <p>{languageLine(languages)}</p>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {has("contact") ? (
          <section id="contact" className="contact" aria-labelledby="contact-title">
            <div className="grid">
              <p className="num" aria-hidden="true">
                {number("contact")}
              </p>
              <h2 id="contact-title" className="contact-title">
                Contact<span className="dot">.</span>
              </h2>
              {profile.email ? (
                <a className="contact-mail" href={`mailto:${profile.email}`}>
                  {profile.email} <span aria-hidden="true">→</span>
                </a>
              ) : null}
              {contactLinks.length ? (
                <ul className="contact-links mono">
                  {contactLinks.map((link) => (
                    <li key={link.label}>
                      <span className="dim">{link.label}</span>
                      <External href={link.url}>{displayUrl(link.url)}</External>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ) : null}
      </main>

      <footer className="foot mono dim">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        {profile.location ? <span>{profile.location}</span> : null}
      </footer>
    </div>
  );
}
