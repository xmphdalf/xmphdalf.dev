import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "profile_languages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" varchar NOT NULL,
  	"level" varchar
  );
  
  CREATE TABLE "_profile_v_version_languages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" varchar NOT NULL,
  	"level" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "profile_experience" ADD COLUMN "start_year" numeric;
  ALTER TABLE "profile_experience" ADD COLUMN "end_year" numeric;
  ALTER TABLE "profile_certifications" ADD COLUMN "issued_year" numeric;
  ALTER TABLE "_profile_v_version_experience" ADD COLUMN "start_year" numeric;
  ALTER TABLE "_profile_v_version_experience" ADD COLUMN "end_year" numeric;
  ALTER TABLE "_profile_v_version_certifications" ADD COLUMN "issued_year" numeric;
  ALTER TABLE "profile_languages" ADD CONSTRAINT "profile_languages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_v_version_languages" ADD CONSTRAINT "_profile_v_version_languages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "profile_languages_order_idx" ON "profile_languages" USING btree ("_order");
  CREATE INDEX "profile_languages_parent_id_idx" ON "profile_languages" USING btree ("_parent_id");
  CREATE INDEX "_profile_v_version_languages_order_idx" ON "_profile_v_version_languages" USING btree ("_order");
  CREATE INDEX "_profile_v_version_languages_parent_id_idx" ON "_profile_v_version_languages" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "profile_languages" CASCADE;
  DROP TABLE "_profile_v_version_languages" CASCADE;
  ALTER TABLE "profile_experience" DROP COLUMN "start_year";
  ALTER TABLE "profile_experience" DROP COLUMN "end_year";
  ALTER TABLE "profile_certifications" DROP COLUMN "issued_year";
  ALTER TABLE "_profile_v_version_experience" DROP COLUMN "start_year";
  ALTER TABLE "_profile_v_version_experience" DROP COLUMN "end_year";
  ALTER TABLE "_profile_v_version_certifications" DROP COLUMN "issued_year";`)
}
