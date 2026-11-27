import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_file_list_style" AS ENUM('list', 'cards');
  CREATE TYPE "public"."enum_pages_blocks_account_opening_style" AS ENUM('accordion', 'tabs');
  CREATE TYPE "public"."enum_pages_hero_aside_form" AS ENUM('none', 'openAccount');
  CREATE TYPE "public"."enum__pages_v_blocks_file_list_style" AS ENUM('list', 'cards');
  CREATE TYPE "public"."enum__pages_v_blocks_account_opening_style" AS ENUM('accordion', 'tabs');
  CREATE TYPE "public"."enum__pages_v_version_hero_aside_form" AS ENUM('none', 'openAccount');
  CREATE TABLE "pages_blocks_contact_form_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"complaints_title" varchar,
  	"complaints_text" varchar,
  	"complaints_email" varchar,
  	"complaints_person_label" varchar DEFAULT 'Contact person for complaints',
  	"complaints_person_name" varchar,
  	"complaints_person_role" varchar,
  	"complaints_phone" varchar,
  	"complaints_phone_href" varchar,
  	"form_title" varchar DEFAULT 'Send us a message',
  	"form_intro" varchar DEFAULT 'All fields are required.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_offices_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address" varchar,
  	"map_url" varchar
  );
  
  CREATE TABLE "pages_blocks_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"limit" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"complaints_title" varchar,
  	"complaints_text" varchar,
  	"complaints_email" varchar,
  	"complaints_person_label" varchar DEFAULT 'Contact person for complaints',
  	"complaints_person_name" varchar,
  	"complaints_person_role" varchar,
  	"complaints_phone" varchar,
  	"complaints_phone_href" varchar,
  	"form_title" varchar DEFAULT 'Send us a message',
  	"form_intro" varchar DEFAULT 'All fields are required.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_offices_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address" varchar,
  	"map_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"limit" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "account_opening_accounts_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  ALTER TABLE "pages_blocks_card_grid_cards" ADD COLUMN "value" varchar;
  ALTER TABLE "pages_blocks_file_list_files" ADD COLUMN "text" varchar;
  ALTER TABLE "pages_blocks_file_list" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_file_list" ADD COLUMN "intro" varchar;
  ALTER TABLE "pages_blocks_file_list" ADD COLUMN "style" "enum_pages_blocks_file_list_style" DEFAULT 'list';
  ALTER TABLE "pages_blocks_account_opening" ADD COLUMN "style" "enum_pages_blocks_account_opening_style" DEFAULT 'accordion';
  ALTER TABLE "pages" ADD COLUMN "hero_aside_form" "enum_pages_hero_aside_form" DEFAULT 'none';
  ALTER TABLE "pages" ADD COLUMN "hero_aside_second_link_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_aside_second_link_path" varchar;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD COLUMN "value" varchar;
  ALTER TABLE "_pages_v_blocks_file_list_files" ADD COLUMN "text" varchar;
  ALTER TABLE "_pages_v_blocks_file_list" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_file_list" ADD COLUMN "intro" varchar;
  ALTER TABLE "_pages_v_blocks_file_list" ADD COLUMN "style" "enum__pages_v_blocks_file_list_style" DEFAULT 'list';
  ALTER TABLE "_pages_v_blocks_account_opening" ADD COLUMN "style" "enum__pages_v_blocks_account_opening_style" DEFAULT 'accordion';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_aside_form" "enum__pages_v_version_hero_aside_form" DEFAULT 'none';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_aside_second_link_label" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_aside_second_link_path" varchar;
  ALTER TABLE "account_opening" ADD COLUMN "faq_title" varchar DEFAULT 'The questions everyone asks (and the straight answers you deserve)';
  ALTER TABLE "pages_blocks_contact_form_details" ADD CONSTRAINT "pages_blocks_contact_form_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_offices_offices" ADD CONSTRAINT "pages_blocks_offices_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_offices" ADD CONSTRAINT "pages_blocks_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_articles" ADD CONSTRAINT "pages_blocks_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form_details" ADD CONSTRAINT "_pages_v_blocks_contact_form_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_offices_offices" ADD CONSTRAINT "_pages_v_blocks_offices_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_offices" ADD CONSTRAINT "_pages_v_blocks_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_articles" ADD CONSTRAINT "_pages_v_blocks_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "account_opening_accounts_faqs" ADD CONSTRAINT "account_opening_accounts_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."account_opening_accounts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_contact_form_details_order_idx" ON "pages_blocks_contact_form_details" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_details_parent_id_idx" ON "pages_blocks_contact_form_details" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_offices_offices_order_idx" ON "pages_blocks_offices_offices" USING btree ("_order");
  CREATE INDEX "pages_blocks_offices_offices_parent_id_idx" ON "pages_blocks_offices_offices" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_offices_order_idx" ON "pages_blocks_offices" USING btree ("_order");
  CREATE INDEX "pages_blocks_offices_parent_id_idx" ON "pages_blocks_offices" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_offices_path_idx" ON "pages_blocks_offices" USING btree ("_path");
  CREATE INDEX "pages_blocks_articles_order_idx" ON "pages_blocks_articles" USING btree ("_order");
  CREATE INDEX "pages_blocks_articles_parent_id_idx" ON "pages_blocks_articles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_articles_path_idx" ON "pages_blocks_articles" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_form_details_order_idx" ON "_pages_v_blocks_contact_form_details" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_details_parent_id_idx" ON "_pages_v_blocks_contact_form_details" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_order_idx" ON "_pages_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_parent_id_idx" ON "_pages_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_path_idx" ON "_pages_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_offices_offices_order_idx" ON "_pages_v_blocks_offices_offices" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_offices_offices_parent_id_idx" ON "_pages_v_blocks_offices_offices" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_offices_order_idx" ON "_pages_v_blocks_offices" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_offices_parent_id_idx" ON "_pages_v_blocks_offices" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_offices_path_idx" ON "_pages_v_blocks_offices" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_articles_order_idx" ON "_pages_v_blocks_articles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_articles_parent_id_idx" ON "_pages_v_blocks_articles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_articles_path_idx" ON "_pages_v_blocks_articles" USING btree ("_path");
  CREATE INDEX "account_opening_accounts_faqs_order_idx" ON "account_opening_accounts_faqs" USING btree ("_order");
  CREATE INDEX "account_opening_accounts_faqs_parent_id_idx" ON "account_opening_accounts_faqs" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_contact_form_details" CASCADE;
  DROP TABLE "pages_blocks_contact_form" CASCADE;
  DROP TABLE "pages_blocks_offices_offices" CASCADE;
  DROP TABLE "pages_blocks_offices" CASCADE;
  DROP TABLE "pages_blocks_articles" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form_details" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form" CASCADE;
  DROP TABLE "_pages_v_blocks_offices_offices" CASCADE;
  DROP TABLE "_pages_v_blocks_offices" CASCADE;
  DROP TABLE "_pages_v_blocks_articles" CASCADE;
  DROP TABLE "account_opening_accounts_faqs" CASCADE;
  ALTER TABLE "pages_blocks_card_grid_cards" DROP COLUMN "value";
  ALTER TABLE "pages_blocks_file_list_files" DROP COLUMN "text";
  ALTER TABLE "pages_blocks_file_list" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_file_list" DROP COLUMN "intro";
  ALTER TABLE "pages_blocks_file_list" DROP COLUMN "style";
  ALTER TABLE "pages_blocks_account_opening" DROP COLUMN "style";
  ALTER TABLE "pages" DROP COLUMN "hero_aside_form";
  ALTER TABLE "pages" DROP COLUMN "hero_aside_second_link_label";
  ALTER TABLE "pages" DROP COLUMN "hero_aside_second_link_path";
  ALTER TABLE "_pages_v_blocks_card_grid_cards" DROP COLUMN "value";
  ALTER TABLE "_pages_v_blocks_file_list_files" DROP COLUMN "text";
  ALTER TABLE "_pages_v_blocks_file_list" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_file_list" DROP COLUMN "intro";
  ALTER TABLE "_pages_v_blocks_file_list" DROP COLUMN "style";
  ALTER TABLE "_pages_v_blocks_account_opening" DROP COLUMN "style";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_aside_form";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_aside_second_link_label";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_aside_second_link_path";
  ALTER TABLE "account_opening" DROP COLUMN "faq_title";
  DROP TYPE "public"."enum_pages_blocks_file_list_style";
  DROP TYPE "public"."enum_pages_blocks_account_opening_style";
  DROP TYPE "public"."enum_pages_hero_aside_form";
  DROP TYPE "public"."enum__pages_v_blocks_file_list_style";
  DROP TYPE "public"."enum__pages_v_blocks_account_opening_style";
  DROP TYPE "public"."enum__pages_v_version_hero_aside_form";`)
}
