import Image from "next/image";
import type React from "react";

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

import { fontVariables } from "./fonts";
import { Masthead, type NavLink } from "./Masthead";
import "./editorial.css";

const availabilityText: Record<Profile["availability"], string | null> = {
  roles: "Open to roles",
  freelance: "Open to freelance",
  both: "Open to roles and freelance",
  notLooking: null,
};

const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function External({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a className={className} href={href} {...newTab}>
      {children}
      <span aria-hidden="true"> ↗</span>
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}

/** A company or client name, linked when a website is set. */
function MaybeLink({ name, url, className }: { name: string; url?: string | null; className?: string }) {
  return url ? (
    <a className={className} href={url} {...newTab}>
      {name}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  ) : (
    <>{name}</>
  );
}

/** The last word set in the italic accent, as the design's display style. */
function DisplayName({ name }: { name: string }) {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return <>{name}</>;
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <em>{last}</em>
    </>
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

function SectionHead({ id, no, title }: { id: string; no: string; title: string }) {
  return (
    <header className="block-head">
      <span className="no" aria-hidden="true">
        {no}.
      </span>
      <h2 id={`${id}-title`}>{title}</h2>
    </header>
  );
}

/** The editorial design: the whole public page, rendered from the Profile. */
export default function EditorialTheme({ profile }: { profile: Profile }) {
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

  const current = experience.find((role) => role.current) ?? experience[0];
  const companies = [...new Set(experience.map((role) => role.company))];
  const singleCompany = companies.length === 1 ? experience[0] : null;
  const firstYear = Math.min(...experience.map((role) => startYearOf(role) ?? Infinity));
  const lastYear = Math.max(...experience.map((role) => endYearOf(role) ?? -Infinity));
  const careerSpan = formatRange(
    Number.isFinite(firstYear) ? String(firstYear) : null,
    experience.some((role) => role.current) ? ONGOING : Number.isFinite(lastYear) ? String(lastYear) : null,
  );

  const links = [
    { label: "GitHub", url: profile.github },
    { label: "LinkedIn", url: profile.linkedin },
    { label: "Credly", url: profile.credly },
    {
      label: "Website",
      url: profile.website && profile.website.replace(/\/$/, "") !== SITE_URL ? profile.website : null,
    },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));

  // The cover repeats the main profile links, like the terminal design's intro.
  const coverLinks = [
    ...links.filter((link) => link.label !== "Website"),
    ...(resume ? [{ label: "Resume", url: resume.url }] : []),
  ];

  const hasContact = Boolean(profile.email) || links.length > 0;
  const sections: NavLink[] = [
    ...(experience.length ? [{ id: "experience", label: "Experience" }] : []),
    ...(clients.length ? [{ id: "clients", label: "Client work" }] : []),
    ...(skills.length ? [{ id: "stack", label: "Stack" }] : []),
    ...(certifications.length || education.length || languages.length
      ? [{ id: "credentials", label: "Credentials" }]
      : []),
    ...(hasContact ? [{ id: "contact", label: "Contact" }] : []),
  ];
  const numberOf = (id: string) => ROMAN[sections.findIndex((section) => section.id === id)] ?? "";
  const has = (id: string) => sections.some((section) => section.id === id);

  return (
    <div className={`editorial ${fontVariables}`}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Masthead
        name={profile.name}
        sections={sections.filter((section) => section.id !== "contact")}
        email={profile.email}
      />

      <main id="main" className="page">
        <section id="top" className="cover" aria-labelledby="top-title">
          <div className="cover-head">
            <div>
              {profile.headline ? <p className="kicker">{profile.headline}</p> : null}
              <h1 id="top-title">
                <DisplayName name={profile.name} />
              </h1>
            </div>
            {photo ? (
              <Image className="photo" src={photo.url} alt={photo.alt} width={176} height={176} priority />
            ) : null}
          </div>

          <div className="cover-foot">
            {bio.length ? (
              <div className="standfirst">
                {bio.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            ) : null}
            <div className="cover-side">
              {profile.email || coverLinks.length ? (
                <div className="cover-cta">
                  {profile.email ? (
                    <a className="btn" href={`mailto:${profile.email}`}>
                      Email me
                    </a>
                  ) : null}
                  {coverLinks.map((link) => (
                    <External key={link.label} className="u quiet" href={link.url}>
                      {link.label}
                    </External>
                  ))}
                </div>
              ) : null}
              {current || profile.location || status ? (
                <dl className="facts">
                  {current ? (
                    <div>
                      <dt>Role</dt>
                      <dd>
                        {current.role}, <MaybeLink className="il" name={current.company} url={current.companyUrl} />
                      </dd>
                    </div>
                  ) : null}
                  {profile.location ? (
                    <div>
                      <dt>Location</dt>
                      <dd>{profile.location}</dd>
                    </div>
                  ) : null}
                  {status ? (
                    <div>
                      <dt>Status</dt>
                      <dd>
                        <span className="dot" aria-hidden="true" />
                        {status}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
            </div>
          </div>
        </section>

        {has("experience") ? (
          <section id="experience" className="block" aria-labelledby="experience-title">
            <SectionHead id="experience" no={numberOf("experience")} title="Experience" />
            {singleCompany ? (
              <p className="intro">
                <MaybeLink className="il" name={singleCompany.company} url={singleCompany.companyUrl} />
                {careerSpan ? <span className="intro-span">{careerSpan}</span> : null}
                {experience.length > 1 ? (
                  <span className="intro-path">
                    {[...experience]
                      .reverse()
                      .map((role) => role.role)
                      .join(" → ")}
                  </span>
                ) : null}
              </p>
            ) : null}
            <ol className="career">
              {experience.map((role) => {
                const when = formatSpan(role);
                const highlights = role.highlights ?? [];
                const where = [!singleCompany ? role.company : null, role.location].filter(Boolean);
                return (
                  <li key={role.id ?? role.role} className={role.current ? "now" : undefined}>
                    <p className="when">{when}</p>
                    <div className="role">
                      <h3>{role.role}</h3>
                      {where.length ? (
                        <p className="org">
                          {!singleCompany ? <MaybeLink className="il" name={role.company} url={role.companyUrl} /> : null}
                          {!singleCompany && role.location ? " · " : null}
                          {role.location}
                        </p>
                      ) : null}
                      {highlights.length ? (
                        <ul className="highlights">
                          {highlights.map((item) => (
                            <li key={item.id ?? item.text}>{item.text}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : null}

        {has("clients") ? (
          <section id="clients" className="block" aria-labelledby="clients-title">
            <SectionHead id="clients" no={numberOf("clients")} title="Client work" />
            {singleCompany ? (
              <p className="intro">
                via <MaybeLink className="il" name={singleCompany.company} url={singleCompany.companyUrl} />
              </p>
            ) : null}
            <ul className="clients">
              {clients.map((client) => {
                const years = normalizeRange(client.years);
                return (
                  <li key={client.id ?? client.name}>
                    {years ? <p className="label">{years}</p> : null}
                    <h3>
                      <MaybeLink className="il" name={client.name} url={client.url} />
                    </h3>
                    {client.role ? <p className="org">{client.role}</p> : null}
                    {client.summary ? <p className="summary">{client.summary}</p> : null}
                    {client.tech?.length ? <p className="tech">{client.tech.join(" · ")}</p> : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {has("stack") ? (
          <section id="stack" className="block" aria-labelledby="stack-title">
            <SectionHead id="stack" no={numberOf("stack")} title="Stack" />
            <dl className="stack">
              {skills.map((group) => (
                <div key={group.id ?? group.group}>
                  <dt className="label">{group.group}</dt>
                  <dd>{group.items!.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {has("credentials") ? (
          <section id="credentials" className="block" aria-labelledby="credentials-title">
            <SectionHead id="credentials" no={numberOf("credentials")} title="Credentials" />
            <div className="creds">
              {certifications.length ? (
                <div>
                  <h3 className="label">Certifications</h3>
                  <ul className="cred-list">
                    {certifications.map((cert) => {
                      const issued = formatMonthOrYear(cert.issuedDate, cert.issuedYear);
                      return (
                        <li key={cert.id ?? cert.name}>
                          <div>
                            <p className="cred-name">{cert.name}</p>
                            {cert.issuer || cert.credlyUrl ? (
                              <p className="cred-meta">
                                {cert.issuer}
                                {cert.issuer && cert.credlyUrl ? " · " : null}
                                {cert.credlyUrl ? (
                                  <a className="il verify" href={cert.credlyUrl} {...newTab}>
                                    Verify<span aria-hidden="true"> ↗</span>
                                    <span className="sr-only"> {cert.name} on Credly (opens in new tab)</span>
                                  </a>
                                ) : null}
                              </p>
                            ) : null}
                          </div>
                          {issued ? <p className="cred-date">{issued}</p> : null}
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
                      <h3 className="label">Education</h3>
                      <ul className="cred-list">
                        {education.map((item) => {
                          const detail = [item.score, item.note].filter(Boolean).join(" · ");
                          return (
                            <li key={item.id ?? item.institution}>
                              <div>
                                <p className="cred-name">{item.degree || item.institution}</p>
                                {item.degree ? <p className="cred-meta">{item.institution}</p> : null}
                              </div>
                              {detail ? <p className="cred-date">{detail}</p> : null}
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : null}
                  {languages.length ? (
                    <>
                      <h3 className="label">Languages</h3>
                      <p className="lang">{languageLine(languages)}</p>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {has("contact") ? (
          <section id="contact" className="closing" aria-labelledby="contact-title">
            <p className="no" aria-hidden="true">
              {numberOf("contact")}.
            </p>
            <h2 id="contact-title">Contact</h2>
            {status ? (
              <p className="status">
                <span className="dot" aria-hidden="true" />
                {status}
              </p>
            ) : null}
            {profile.email ? (
              <p>
                <a className="u mail" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </p>
            ) : null}
            {links.length ? (
              <ul className="social">
                {links.map((link) => (
                  <li key={link.label}>
                    <External className="u" href={link.url}>
                      {link.label}
                      <span className="sr-only">: {displayUrl(link.url)}</span>
                    </External>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}
      </main>

      <footer className="colophon">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <a className="u" href="#top">
          Back to top<span aria-hidden="true"> ↑</span>
        </a>
      </footer>
    </div>
  );
}
