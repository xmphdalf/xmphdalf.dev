import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "profile_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"years" varchar,
  	"role" varchar,
  	"url" varchar,
  	"summary" varchar
  );
  
  CREATE TABLE "_profile_v_version_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"years" varchar,
  	"role" varchar,
  	"url" varchar,
  	"summary" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "profile_clients" ADD CONSTRAINT "profile_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_v_version_clients" ADD CONSTRAINT "_profile_v_version_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "profile_clients_order_idx" ON "profile_clients" USING btree ("_order");
  CREATE INDEX "profile_clients_parent_id_idx" ON "profile_clients" USING btree ("_parent_id");
  CREATE INDEX "_profile_v_version_clients_order_idx" ON "_profile_v_version_clients" USING btree ("_order");
  CREATE INDEX "_profile_v_version_clients_parent_id_idx" ON "_profile_v_version_clients" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "profile_clients" CASCADE;
  DROP TABLE "_profile_v_version_clients" CASCADE;`)
}
