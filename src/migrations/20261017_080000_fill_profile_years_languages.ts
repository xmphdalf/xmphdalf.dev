import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import type { Profile } from "../payload-types";

/** Years from the resume, matched by role title. */
const roleYears: Record<string, { startYear?: number; endYear?: number }> = {
  "Senior Software Engineer": { startYear: 2026 },
  "Software Engineer": { startYear: 2023, endYear: 2026 },
  "Associate Software Engineer": { startYear: 2022, endYear: 2023 },
  "Software Engineer Intern": { startYear: 2021, endYear: 2022 },
};

/** Issue years from the resume, matched by certification name. */
const certYears: Record<string, number> = {
  "Claude Certified Architect – Professional": 2026,
  "AWS Certified Generative AI Developer – Professional": 2026,
  "Google Cloud Certified – Generative AI Leader": 2025,
  "Google Cloud Certified – Associate Cloud Engineer": 2024,
};

const languages: NonNullable<Profile["languages"]> = [
  { language: "English", level: "Fluent" },
  { language: "Hindi", level: "Fluent" },
  { language: "Gujarati", level: "Native" },
];

const isEmpty = (value: unknown): boolean => value === null || value === undefined;

/**
 * Fills year fields and languages on the existing profile. Only empty values
 * are set; anything already filled in (for example edited in the admin) is
 * left as it is. Safe to run more than once.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const current = await payload.findGlobal({ slug: "profile", depth: 0, overrideAccess: true, req });

  let changed = false;

  const experience = (current.experience ?? []).map((entry) => {
    const years = roleYears[entry.role.trim()];
    if (!years) return entry;
    const next = { ...entry };
    if (isEmpty(next.startYear) && years.startYear) {
      next.startYear = years.startYear;
      changed = true;
    }
    if (isEmpty(next.endYear) && years.endYear && !next.current) {
      next.endYear = years.endYear;
      changed = true;
    }
    return next;
  });

  const certifications = (current.certifications ?? []).map((cert) => {
    const year = certYears[cert.name.trim()];
    if (!year || !isEmpty(cert.issuedYear)) return cert;
    changed = true;
    return { ...cert, issuedYear: year };
  });

  const fillLanguages = !current.languages?.length;
  if (fillLanguages) changed = true;

  if (!changed) {
    payload.logger.info("Profile years and languages already set, nothing to fill.");
    return;
  }

  await payload.updateGlobal({
    slug: "profile",
    data: {
      experience,
      certifications,
      ...(fillLanguages ? { languages } : {}),
    },
    overrideAccess: true,
    context: { skipRevalidate: true },
    req,
  });
  payload.logger.info("Filled empty profile years and languages.");
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Values may have been edited since, so nothing is removed on rollback.
  payload.logger.info("Profile fill rollback is a no-op.");
}
