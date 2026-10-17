import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { profileSeed } from "../seed/profile";

/**
 * Fills the profile global with the initial content, but only when it is
 * still empty, so content edited in the admin is never overwritten.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const current = await payload.findGlobal({ slug: "profile", depth: 0, overrideAccess: true, req });

  const isEmpty =
    !current.name &&
    !current.experience?.length &&
    !current.education?.length &&
    !current.certifications?.length &&
    !current.skills?.length;

  if (!isEmpty) {
    payload.logger.info("Profile already has content, skipping seed.");
    return;
  }

  await payload.updateGlobal({ slug: "profile", data: profileSeed, overrideAccess: true, req });
  payload.logger.info("Seeded profile content.");
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Content isn't removed on rollback; it may have been edited since.
  payload.logger.info("Seed rollback is a no-op.");
}
