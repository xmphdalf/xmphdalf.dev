import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "appearance" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"active_theme" varchar DEFAULT 'terminal' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "appearance_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_appearance_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_active_theme" varchar DEFAULT 'terminal' NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_appearance_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "appearance_texts" ADD CONSTRAINT "appearance_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."appearance"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_appearance_v_texts" ADD CONSTRAINT "_appearance_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_appearance_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "appearance_texts_order_parent" ON "appearance_texts" USING btree ("order","parent_id");
  CREATE INDEX "_appearance_v_created_at_idx" ON "_appearance_v" USING btree ("created_at");
  CREATE INDEX "_appearance_v_updated_at_idx" ON "_appearance_v" USING btree ("updated_at");
  CREATE INDEX "_appearance_v_texts_order_parent" ON "_appearance_v_texts" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "appearance" CASCADE;
  DROP TABLE "appearance_texts" CASCADE;
  DROP TABLE "_appearance_v" CASCADE;
  DROP TABLE "_appearance_v_texts" CASCADE;`)
}
