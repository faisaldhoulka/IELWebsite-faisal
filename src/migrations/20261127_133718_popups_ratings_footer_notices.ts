import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_popups_notices_links_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_footer_investor_complaints_links_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_site_settings_ratings_reports_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TABLE "popups_notices_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_popups_notices_links_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean
  );
  
  CREATE TABLE "popups_notices_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"path" varchar,
  	"image_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "popups_notices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"body" jsonb,
  	"close_label" varchar
  );
  
  CREATE TABLE "popups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"dont_show_again_label" varchar DEFAULT 'Don’t show this again',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_investor_complaints_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_footer_investor_complaints_links_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean
  );
  
  CREATE TABLE "site_settings_contact_other_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "site_settings_ratings_reports" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_site_settings_ratings_reports_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean
  );
  
  ALTER TABLE "footer" ADD COLUMN "investor_complaints_title" varchar DEFAULT 'Investor complaints';
  ALTER TABLE "footer" ADD COLUMN "vendor_notice_title" varchar;
  ALTER TABLE "footer" ADD COLUMN "vendor_notice_text" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "ratings_text" varchar;
  ALTER TABLE "popups_notices_links" ADD CONSTRAINT "popups_notices_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "popups_notices_links" ADD CONSTRAINT "popups_notices_links_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "popups_notices_links" ADD CONSTRAINT "popups_notices_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."popups_notices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "popups_notices_images" ADD CONSTRAINT "popups_notices_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "popups_notices_images" ADD CONSTRAINT "popups_notices_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."popups_notices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "popups_notices" ADD CONSTRAINT "popups_notices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."popups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_investor_complaints_links" ADD CONSTRAINT "footer_investor_complaints_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_investor_complaints_links" ADD CONSTRAINT "footer_investor_complaints_links_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_investor_complaints_links" ADD CONSTRAINT "footer_investor_complaints_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_contact_other_phones" ADD CONSTRAINT "site_settings_contact_other_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_ratings_reports" ADD CONSTRAINT "site_settings_ratings_reports_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_ratings_reports" ADD CONSTRAINT "site_settings_ratings_reports_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_ratings_reports" ADD CONSTRAINT "site_settings_ratings_reports_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "popups_notices_links_order_idx" ON "popups_notices_links" USING btree ("_order");
  CREATE INDEX "popups_notices_links_parent_id_idx" ON "popups_notices_links" USING btree ("_parent_id");
  CREATE INDEX "popups_notices_links_page_idx" ON "popups_notices_links" USING btree ("page_id");
  CREATE INDEX "popups_notices_links_file_idx" ON "popups_notices_links" USING btree ("file_id");
  CREATE INDEX "popups_notices_images_order_idx" ON "popups_notices_images" USING btree ("_order");
  CREATE INDEX "popups_notices_images_parent_id_idx" ON "popups_notices_images" USING btree ("_parent_id");
  CREATE INDEX "popups_notices_images_image_idx" ON "popups_notices_images" USING btree ("image_id");
  CREATE INDEX "popups_notices_order_idx" ON "popups_notices" USING btree ("_order");
  CREATE INDEX "popups_notices_parent_id_idx" ON "popups_notices" USING btree ("_parent_id");
  CREATE INDEX "footer_investor_complaints_links_order_idx" ON "footer_investor_complaints_links" USING btree ("_order");
  CREATE INDEX "footer_investor_complaints_links_parent_id_idx" ON "footer_investor_complaints_links" USING btree ("_parent_id");
  CREATE INDEX "footer_investor_complaints_links_page_idx" ON "footer_investor_complaints_links" USING btree ("page_id");
  CREATE INDEX "footer_investor_complaints_links_file_idx" ON "footer_investor_complaints_links" USING btree ("file_id");
  CREATE INDEX "site_settings_contact_other_phones_order_idx" ON "site_settings_contact_other_phones" USING btree ("_order");
  CREATE INDEX "site_settings_contact_other_phones_parent_id_idx" ON "site_settings_contact_other_phones" USING btree ("_parent_id");
  CREATE INDEX "site_settings_ratings_reports_order_idx" ON "site_settings_ratings_reports" USING btree ("_order");
  CREATE INDEX "site_settings_ratings_reports_parent_id_idx" ON "site_settings_ratings_reports" USING btree ("_parent_id");
  CREATE INDEX "site_settings_ratings_reports_page_idx" ON "site_settings_ratings_reports" USING btree ("page_id");
  CREATE INDEX "site_settings_ratings_reports_file_idx" ON "site_settings_ratings_reports" USING btree ("file_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "popups_notices_links" CASCADE;
  DROP TABLE "popups_notices_images" CASCADE;
  DROP TABLE "popups_notices" CASCADE;
  DROP TABLE "popups" CASCADE;
  DROP TABLE "footer_investor_complaints_links" CASCADE;
  DROP TABLE "site_settings_contact_other_phones" CASCADE;
  DROP TABLE "site_settings_ratings_reports" CASCADE;
  ALTER TABLE "footer" DROP COLUMN "investor_complaints_title";
  ALTER TABLE "footer" DROP COLUMN "vendor_notice_title";
  ALTER TABLE "footer" DROP COLUMN "vendor_notice_text";
  ALTER TABLE "site_settings" DROP COLUMN "ratings_text";
  DROP TYPE "public"."enum_popups_notices_links_type";
  DROP TYPE "public"."enum_footer_investor_complaints_links_type";
  DROP TYPE "public"."enum_site_settings_ratings_reports_type";`)
}
