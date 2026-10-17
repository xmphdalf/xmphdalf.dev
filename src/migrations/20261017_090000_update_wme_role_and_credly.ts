import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

const WME_ROLE_OLD = "Software Engineer, then Senior Software Engineer from July 2026";
const WME_ROLE_NEW = "Software Engineer → Senior Software Engineer";

// Credly now redirects the old badge link to this one.
const ACE_BADGE_OLD = "https://www.credly.com/badges/80feed65-bf34-48ae-8d86-4930c27d34b6/public_url";
const ACE_BADGE_NEW = "https://www.credly.com/badges/ed7009a0-5dd6-44e8-b470-910d0cf91670/public_url";

/**
 * Updates the WME role wording and the Associate Cloud Engineer badge link,
 * each only while it still holds the original value, so edits made in the
 * admin are kept.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const current = await payload.findGlobal({ slug: "profile", depth: 0, overrideAccess: true, req });

  let changed = false;

  const clients = (current.clients ?? []).map((client) => {
    if (client.role !== WME_ROLE_OLD) return client;
    changed = true;
    return { ...client, role: WME_ROLE_NEW };
  });

  const certifications = (current.certifications ?? []).map((cert) => {
    if (cert.credlyUrl !== ACE_BADGE_OLD) return cert;
    changed = true;
    return { ...cert, credlyUrl: ACE_BADGE_NEW };
  });

  if (!changed) {
    payload.logger.info("WME role and badge link already updated or edited, nothing to change.");
    return;
  }

  await payload.updateGlobal({
    slug: "profile",
    data: { clients, certifications },
    overrideAccess: true,
    context: { skipRevalidate: true },
    req,
  });
  payload.logger.info("Updated WME role and badge link.");
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info("WME role and badge link rollback is a no-op.");
}
