import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_tenants_theme" AS ENUM('editorial');
  CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'tenant-admin');
  CREATE TYPE "public"."enum_credentials_tier" AS ENUM('foundational', 'associate', 'professional', 'expert', 'specialty');
  CREATE TYPE "public"."enum_credentials_status" AS ENUM('active', 'expired', 'revoked');
  CREATE TABLE "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"theme" "enum_tenants_theme" DEFAULT 'editorial' NOT NULL,
  	"domain" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_tenants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'tenant-admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "projects_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"paragraph" varchar NOT NULL
  );
  
  CREATE TABLE "projects_meta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar NOT NULL,
  	"year" numeric,
  	"kind" varchar,
  	"role" varchar,
  	"summary" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "credentials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"seal" varchar,
  	"issuer" varchar NOT NULL,
  	"tier" "enum_credentials_tier",
  	"title" varchar NOT NULL,
  	"short" varchar,
  	"description" varchar,
  	"issued" timestamp(3) with time zone,
  	"validity" varchar,
  	"credential_id" varchar,
  	"verify_url" varchar,
  	"status" "enum_credentials_status" DEFAULT 'active',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "profiles_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"paragraph" varchar NOT NULL
  );
  
  CREATE TABLE "profiles_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"paragraph" varchar NOT NULL
  );
  
  CREATE TABLE "profiles_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "profiles_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"handle" varchar
  );
  
  CREATE TABLE "profiles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"focus" varchar,
  	"location" varchar,
  	"lead" varchar,
  	"status_label" varchar,
  	"status_text" varchar,
  	"open_to_work" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "stack_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "stack_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"group_name" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tenants_id" integer,
  	"users_id" integer,
  	"projects_id" integer,
  	"credentials_id" integer,
  	"profiles_id" integer,
  	"stack_groups_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_stack" ADD CONSTRAINT "projects_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_body" ADD CONSTRAINT "projects_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_meta" ADD CONSTRAINT "projects_meta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "credentials" ADD CONSTRAINT "credentials_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profiles_intro" ADD CONSTRAINT "profiles_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profiles_body" ADD CONSTRAINT "profiles_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profiles_facts" ADD CONSTRAINT "profiles_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profiles_links" ADD CONSTRAINT "profiles_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profiles" ADD CONSTRAINT "profiles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stack_groups_items" ADD CONSTRAINT "stack_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stack_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stack_groups" ADD CONSTRAINT "stack_groups_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_credentials_fk" FOREIGN KEY ("credentials_id") REFERENCES "public"."credentials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_profiles_fk" FOREIGN KEY ("profiles_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stack_groups_fk" FOREIGN KEY ("stack_groups_id") REFERENCES "public"."stack_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "tenants_slug_idx" ON "tenants" USING btree ("slug");
  CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE INDEX "users_tenants_order_idx" ON "users_tenants" USING btree ("_order");
  CREATE INDEX "users_tenants_parent_id_idx" ON "users_tenants" USING btree ("_parent_id");
  CREATE INDEX "users_tenants_tenant_idx" ON "users_tenants" USING btree ("tenant_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "projects_stack_order_idx" ON "projects_stack" USING btree ("_order");
  CREATE INDEX "projects_stack_parent_id_idx" ON "projects_stack" USING btree ("_parent_id");
  CREATE INDEX "projects_body_order_idx" ON "projects_body" USING btree ("_order");
  CREATE INDEX "projects_body_parent_id_idx" ON "projects_body" USING btree ("_parent_id");
  CREATE INDEX "projects_meta_order_idx" ON "projects_meta" USING btree ("_order");
  CREATE INDEX "projects_meta_parent_id_idx" ON "projects_meta" USING btree ("_parent_id");
  CREATE INDEX "projects_tenant_idx" ON "projects" USING btree ("tenant_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "credentials_tenant_idx" ON "credentials" USING btree ("tenant_id");
  CREATE INDEX "credentials_updated_at_idx" ON "credentials" USING btree ("updated_at");
  CREATE INDEX "credentials_created_at_idx" ON "credentials" USING btree ("created_at");
  CREATE INDEX "profiles_intro_order_idx" ON "profiles_intro" USING btree ("_order");
  CREATE INDEX "profiles_intro_parent_id_idx" ON "profiles_intro" USING btree ("_parent_id");
  CREATE INDEX "profiles_body_order_idx" ON "profiles_body" USING btree ("_order");
  CREATE INDEX "profiles_body_parent_id_idx" ON "profiles_body" USING btree ("_parent_id");
  CREATE INDEX "profiles_facts_order_idx" ON "profiles_facts" USING btree ("_order");
  CREATE INDEX "profiles_facts_parent_id_idx" ON "profiles_facts" USING btree ("_parent_id");
  CREATE INDEX "profiles_links_order_idx" ON "profiles_links" USING btree ("_order");
  CREATE INDEX "profiles_links_parent_id_idx" ON "profiles_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "profiles_tenant_idx" ON "profiles" USING btree ("tenant_id");
  CREATE INDEX "profiles_updated_at_idx" ON "profiles" USING btree ("updated_at");
  CREATE INDEX "profiles_created_at_idx" ON "profiles" USING btree ("created_at");
  CREATE INDEX "stack_groups_items_order_idx" ON "stack_groups_items" USING btree ("_order");
  CREATE INDEX "stack_groups_items_parent_id_idx" ON "stack_groups_items" USING btree ("_parent_id");
  CREATE INDEX "stack_groups_tenant_idx" ON "stack_groups" USING btree ("tenant_id");
  CREATE INDEX "stack_groups_updated_at_idx" ON "stack_groups" USING btree ("updated_at");
  CREATE INDEX "stack_groups_created_at_idx" ON "stack_groups" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_credentials_id_idx" ON "payload_locked_documents_rels" USING btree ("credentials_id");
  CREATE INDEX "payload_locked_documents_rels_profiles_id_idx" ON "payload_locked_documents_rels" USING btree ("profiles_id");
  CREATE INDEX "payload_locked_documents_rels_stack_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("stack_groups_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "tenants" CASCADE;
  DROP TABLE "users_tenants" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "projects_stack" CASCADE;
  DROP TABLE "projects_body" CASCADE;
  DROP TABLE "projects_meta" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "credentials" CASCADE;
  DROP TABLE "profiles_intro" CASCADE;
  DROP TABLE "profiles_body" CASCADE;
  DROP TABLE "profiles_facts" CASCADE;
  DROP TABLE "profiles_links" CASCADE;
  DROP TABLE "profiles" CASCADE;
  DROP TABLE "stack_groups_items" CASCADE;
  DROP TABLE "stack_groups" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_tenants_theme";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_credentials_tier";
  DROP TYPE "public"."enum_credentials_status";`)
}
