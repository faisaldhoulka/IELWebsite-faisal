import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_card_grid_cards_link_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_background" AS ENUM('white', 'mist', 'pine');
  CREATE TYPE "public"."enum_pages_blocks_team_list_group" AS ENUM('leadership', 'board', 'all');
  CREATE TYPE "public"."enum_pages_blocks_cta_band_buttons_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_pages_blocks_cta_band_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_buttons_buttons_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_pages_blocks_buttons_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_cards_link_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_background" AS ENUM('white', 'mist', 'pine');
  CREATE TYPE "public"."enum__pages_v_blocks_team_list_group" AS ENUM('leadership', 'board', 'all');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_band_buttons_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_band_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_buttons_buttons_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum__pages_v_blocks_buttons_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_team_members_group" AS ENUM('leadership', 'board');
  CREATE TYPE "public"."enum_static_financial_statements_tab" AS ENUM('Audited Financials 30 June', 'Half Yearly 31 Dec', 'Quarter Ended 30 Sept', 'Quarter Ended 31 March', 'LCB');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_audit_log_action" AS ENUM('create', 'update', 'delete');
  CREATE TYPE "public"."enum_homepage_blocks_hero_buttons_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_homepage_blocks_hero_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_homepage_blocks_transactions_section_link_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_homepage_blocks_process_steps_color" AS ENUM('green', 'wine', 'red', 'pine');
  CREATE TYPE "public"."enum_homepage_blocks_team_section_link_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_homepage_blocks_insights_section_link_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_homepage_blocks_cta_band_buttons_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_homepage_blocks_cta_band_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__homepage_v_blocks_hero_buttons_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum__homepage_v_blocks_hero_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__homepage_v_blocks_transactions_section_link_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum__homepage_v_blocks_process_steps_color" AS ENUM('green', 'wine', 'red', 'pine');
  CREATE TYPE "public"."enum__homepage_v_blocks_team_section_link_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum__homepage_v_blocks_insights_section_link_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum__homepage_v_blocks_cta_band_buttons_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum__homepage_v_blocks_cta_band_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_navigation_items_children_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_navigation_items_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_navigation_cta_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_footer_columns_links_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TYPE "public"."enum_site_settings_utility_bar_links_type" AS ENUM('path', 'page', 'url', 'file');
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"image_id" integer,
  	"link_label" varchar,
  	"link_type" "enum_pages_blocks_card_grid_cards_link_type" DEFAULT 'path',
  	"link_path" varchar,
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_file_id" integer,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "pages_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_card_grid_background" DEFAULT 'white',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_file_list_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"date" timestamp(3) with time zone,
  	"file_id" integer,
  	"path" varchar
  );
  
  CREATE TABLE "pages_blocks_file_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"group" "enum_pages_blocks_team_list_group" DEFAULT 'all',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_band_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_pages_blocks_cta_band_buttons_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean,
  	"style" "enum_pages_blocks_cta_band_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_buttons_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_pages_blocks_buttons_buttons_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean,
  	"style" "enum_pages_blocks_buttons_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_title" varchar,
  	"hero_intro" varchar,
  	"show_contact_band" boolean DEFAULT true,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"content" jsonb NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"image_id" integer,
  	"link_label" varchar,
  	"link_type" "enum__pages_v_blocks_card_grid_cards_link_type" DEFAULT 'path',
  	"link_path" varchar,
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_file_id" integer,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_card_grid_background" DEFAULT 'white',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_file_list_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"date" timestamp(3) with time zone,
  	"file_id" integer,
  	"path" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_file_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"group" "enum__pages_v_blocks_team_list_group" DEFAULT 'all',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum__pages_v_blocks_cta_band_buttons_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean,
  	"style" "enum__pages_v_blocks_cta_band_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_buttons_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum__pages_v_blocks_buttons_buttons_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean,
  	"style" "enum__pages_v_blocks_buttons_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_hero_eyebrow" varchar,
  	"version_hero_title" varchar,
  	"version_hero_intro" varchar,
  	"version_show_contact_band" boolean DEFAULT true,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"cta_label" varchar DEFAULT 'Talk to us',
  	"page_id" integer,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "transactions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client" varchar NOT NULL,
  	"year" varchar NOT NULL,
  	"practice_id" integer,
  	"practice_label" varchar,
  	"description" varchar NOT NULL,
  	"size" varchar,
  	"role" varchar,
  	"logo_id" integer,
  	"featured" boolean DEFAULT true,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"group" "enum_team_members_group" DEFAULT 'leadership',
  	"short_bio" varchar,
  	"bio" jsonb,
  	"portrait_id" integer,
  	"show_on_homepage" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"logo_path" varchar,
  	"url" varchar,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "announcements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"summary" varchar,
  	"body" jsonb,
  	"file_id" integer,
  	"show_on_homepage_until" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "corporate_reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"file_id" integer,
  	"path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "static_financial_statements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tab" "enum_static_financial_statements_tab" NOT NULL,
  	"title" varchar NOT NULL,
  	"date" timestamp(3) with time zone,
  	"file_id" integer,
  	"path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" varchar,
  	"prefix" varchar DEFAULT 'media',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
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
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "audit_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer,
  	"user_email" varchar,
  	"action" "enum_audit_log_action" NOT NULL,
  	"target" varchar NOT NULL,
  	"item_id" varchar,
  	"item_title" varchar,
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
  	"pages_id" integer,
  	"services_id" integer,
  	"transactions_id" integer,
  	"team_members_id" integer,
  	"partners_id" integer,
  	"announcements_id" integer,
  	"corporate_reports_id" integer,
  	"static_financial_statements_id" integer,
  	"media_id" integer,
  	"users_id" integer,
  	"audit_log_id" integer
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
  
  CREATE TABLE "homepage_blocks_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_homepage_blocks_hero_buttons_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean,
  	"style" "enum_homepage_blocks_hero_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "homepage_blocks_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"cards_link_to_contact" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_transactions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"section_link_label" varchar,
  	"section_link_type" "enum_homepage_blocks_transactions_section_link_type" DEFAULT 'path',
  	"section_link_path" varchar,
  	"section_link_page_id" integer,
  	"section_link_url" varchar,
  	"section_link_file_id" integer,
  	"section_link_new_tab" boolean,
  	"limit" numeric DEFAULT 4,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"color" "enum_homepage_blocks_process_steps_color" DEFAULT 'green'
  );
  
  CREATE TABLE "homepage_blocks_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"section_link_label" varchar,
  	"section_link_type" "enum_homepage_blocks_team_section_link_type" DEFAULT 'path',
  	"section_link_path" varchar,
  	"section_link_page_id" integer,
  	"section_link_url" varchar,
  	"section_link_file_id" integer,
  	"section_link_new_tab" boolean,
  	"limit" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_insights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"href" varchar DEFAULT '/research'
  );
  
  CREATE TABLE "homepage_blocks_insights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"section_link_label" varchar,
  	"section_link_type" "enum_homepage_blocks_insights_section_link_type" DEFAULT 'path',
  	"section_link_path" varchar,
  	"section_link_page_id" integer,
  	"section_link_url" varchar,
  	"section_link_file_id" integer,
  	"section_link_new_tab" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_cta_band_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_homepage_blocks_cta_band_buttons_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean,
  	"style" "enum_homepage_blocks_cta_band_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "homepage_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"title" varchar DEFAULT 'Associated companies' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"show_contact_details" boolean DEFAULT true,
  	"submit_label" varchar DEFAULT 'Send enquiry',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_homepage_v_blocks_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum__homepage_v_blocks_hero_buttons_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean,
  	"style" "enum__homepage_v_blocks_hero_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"cards_link_to_contact" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_transactions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"section_link_label" varchar,
  	"section_link_type" "enum__homepage_v_blocks_transactions_section_link_type" DEFAULT 'path',
  	"section_link_path" varchar,
  	"section_link_page_id" integer,
  	"section_link_url" varchar,
  	"section_link_file_id" integer,
  	"section_link_new_tab" boolean,
  	"limit" numeric DEFAULT 4,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"color" "enum__homepage_v_blocks_process_steps_color" DEFAULT 'green',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"section_link_label" varchar,
  	"section_link_type" "enum__homepage_v_blocks_team_section_link_type" DEFAULT 'path',
  	"section_link_path" varchar,
  	"section_link_page_id" integer,
  	"section_link_url" varchar,
  	"section_link_file_id" integer,
  	"section_link_new_tab" boolean,
  	"limit" numeric DEFAULT 3,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_insights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"href" varchar DEFAULT '/research',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_insights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"section_link_label" varchar,
  	"section_link_type" "enum__homepage_v_blocks_insights_section_link_type" DEFAULT 'path',
  	"section_link_path" varchar,
  	"section_link_page_id" integer,
  	"section_link_url" varchar,
  	"section_link_file_id" integer,
  	"section_link_new_tab" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_cta_band_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum__homepage_v_blocks_cta_band_buttons_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean,
  	"style" "enum__homepage_v_blocks_cta_band_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"title" varchar DEFAULT 'Associated companies' NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean,
  	"anchor" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"show_contact_details" boolean DEFAULT true,
  	"submit_label" varchar DEFAULT 'Send enquiry',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "navigation_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_navigation_items_children_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean
  );
  
  CREATE TABLE "navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_navigation_items_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_label" varchar NOT NULL,
  	"cta_type" "enum_navigation_cta_type" DEFAULT 'path',
  	"cta_path" varchar,
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_file_id" integer,
  	"cta_new_tab" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_footer_columns_links_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "footer_regulatory_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"about" varchar,
  	"complaints_button_label" varchar DEFAULT 'Complaints (SECP, PSX)',
  	"complaints_title" varchar,
  	"complaints_body" jsonb,
  	"complaints_pdf_path" varchar DEFAULT '/docs/Procedure-for-Complaint-Handling-MUFAP.pdf',
  	"complaints_pdf_id" integer,
  	"copyright" varchar DEFAULT 'Integrated Equities Limited. All rights reserved.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_utility_bar_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"type" "enum_site_settings_utility_bar_links_type" DEFAULT 'path',
  	"path" varchar,
  	"page_id" integer,
  	"url" varchar,
  	"file_id" integer,
  	"new_tab" boolean
  );
  
  CREATE TABLE "site_settings_contact_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"city" varchar,
  	"address" varchar
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"network" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"utility_bar_text" varchar DEFAULT 'PSX TREC holder · VIS entity rating A- / A-2',
  	"contact_phone" varchar,
  	"contact_phone_href" varchar,
  	"contact_email" varchar,
  	"client_login_url" varchar,
  	"booking_url" varchar DEFAULT 'https://meetings.hubspot.com/jessica-brennan',
  	"default_seo_title" varchar,
  	"default_seo_description" varchar,
  	"default_seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_link_file_id_media_id_fk" FOREIGN KEY ("link_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid" ADD CONSTRAINT "pages_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_file_list_files" ADD CONSTRAINT "pages_blocks_file_list_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_file_list_files" ADD CONSTRAINT "pages_blocks_file_list_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_file_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_file_list" ADD CONSTRAINT "pages_blocks_file_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_list" ADD CONSTRAINT "pages_blocks_team_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band_buttons" ADD CONSTRAINT "pages_blocks_cta_band_buttons_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band_buttons" ADD CONSTRAINT "pages_blocks_cta_band_buttons_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band_buttons" ADD CONSTRAINT "pages_blocks_cta_band_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_buttons_buttons" ADD CONSTRAINT "pages_blocks_buttons_buttons_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_buttons_buttons" ADD CONSTRAINT "pages_blocks_buttons_buttons_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_buttons_buttons" ADD CONSTRAINT "pages_blocks_buttons_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_buttons" ADD CONSTRAINT "pages_blocks_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_link_file_id_media_id_fk" FOREIGN KEY ("link_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD CONSTRAINT "_pages_v_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_file_list_files" ADD CONSTRAINT "_pages_v_blocks_file_list_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_file_list_files" ADD CONSTRAINT "_pages_v_blocks_file_list_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_file_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_file_list" ADD CONSTRAINT "_pages_v_blocks_file_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_list" ADD CONSTRAINT "_pages_v_blocks_team_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band_buttons" ADD CONSTRAINT "_pages_v_blocks_cta_band_buttons_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band_buttons" ADD CONSTRAINT "_pages_v_blocks_cta_band_buttons_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band_buttons" ADD CONSTRAINT "_pages_v_blocks_cta_band_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD CONSTRAINT "_pages_v_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_buttons_buttons" ADD CONSTRAINT "_pages_v_blocks_buttons_buttons_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_buttons_buttons" ADD CONSTRAINT "_pages_v_blocks_buttons_buttons_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_buttons_buttons" ADD CONSTRAINT "_pages_v_blocks_buttons_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_buttons" ADD CONSTRAINT "_pages_v_blocks_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_practice_id_services_id_fk" FOREIGN KEY ("practice_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "corporate_reports" ADD CONSTRAINT "corporate_reports_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "static_financial_statements" ADD CONSTRAINT "static_financial_statements_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_transactions_fk" FOREIGN KEY ("transactions_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_corporate_reports_fk" FOREIGN KEY ("corporate_reports_id") REFERENCES "public"."corporate_reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_static_financial_statements_fk" FOREIGN KEY ("static_financial_statements_id") REFERENCES "public"."static_financial_statements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_log_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero_buttons" ADD CONSTRAINT "homepage_blocks_hero_buttons_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero_buttons" ADD CONSTRAINT "homepage_blocks_hero_buttons_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero_buttons" ADD CONSTRAINT "homepage_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero_stats" ADD CONSTRAINT "homepage_blocks_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_hero" ADD CONSTRAINT "homepage_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_services" ADD CONSTRAINT "homepage_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_transactions" ADD CONSTRAINT "homepage_blocks_transactions_section_link_page_id_pages_id_fk" FOREIGN KEY ("section_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_transactions" ADD CONSTRAINT "homepage_blocks_transactions_section_link_file_id_media_id_fk" FOREIGN KEY ("section_link_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_transactions" ADD CONSTRAINT "homepage_blocks_transactions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_process_steps" ADD CONSTRAINT "homepage_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_process" ADD CONSTRAINT "homepage_blocks_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_team" ADD CONSTRAINT "homepage_blocks_team_section_link_page_id_pages_id_fk" FOREIGN KEY ("section_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_team" ADD CONSTRAINT "homepage_blocks_team_section_link_file_id_media_id_fk" FOREIGN KEY ("section_link_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_team" ADD CONSTRAINT "homepage_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_insights_items" ADD CONSTRAINT "homepage_blocks_insights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_insights" ADD CONSTRAINT "homepage_blocks_insights_section_link_page_id_pages_id_fk" FOREIGN KEY ("section_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_insights" ADD CONSTRAINT "homepage_blocks_insights_section_link_file_id_media_id_fk" FOREIGN KEY ("section_link_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_insights" ADD CONSTRAINT "homepage_blocks_insights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta_band_buttons" ADD CONSTRAINT "homepage_blocks_cta_band_buttons_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta_band_buttons" ADD CONSTRAINT "homepage_blocks_cta_band_buttons_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta_band_buttons" ADD CONSTRAINT "homepage_blocks_cta_band_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_cta_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta_band" ADD CONSTRAINT "homepage_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_partners" ADD CONSTRAINT "homepage_blocks_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_contact" ADD CONSTRAINT "homepage_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_hero_buttons" ADD CONSTRAINT "_homepage_v_blocks_hero_buttons_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_hero_buttons" ADD CONSTRAINT "_homepage_v_blocks_hero_buttons_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_hero_buttons" ADD CONSTRAINT "_homepage_v_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_hero_stats" ADD CONSTRAINT "_homepage_v_blocks_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_hero" ADD CONSTRAINT "_homepage_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_services" ADD CONSTRAINT "_homepage_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_transactions" ADD CONSTRAINT "_homepage_v_blocks_transactions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_transactions" ADD CONSTRAINT "_homepage_v_blocks_transactions_section_link_page_i_4b47472c_fk" FOREIGN KEY ("section_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_transactions" ADD CONSTRAINT "_homepage_v_blocks_transactions_section_link_file_i_0d7cf2e7_fk" FOREIGN KEY ("section_link_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_process_steps" ADD CONSTRAINT "_homepage_v_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_process" ADD CONSTRAINT "_homepage_v_blocks_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_team" ADD CONSTRAINT "_homepage_v_blocks_team_section_link_page_id_pages_id_fk" FOREIGN KEY ("section_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_team" ADD CONSTRAINT "_homepage_v_blocks_team_section_link_file_id_media_id_fk" FOREIGN KEY ("section_link_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_team" ADD CONSTRAINT "_homepage_v_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_insights_items" ADD CONSTRAINT "_homepage_v_blocks_insights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_insights" ADD CONSTRAINT "_homepage_v_blocks_insights_section_link_page_id_pages_id_fk" FOREIGN KEY ("section_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_insights" ADD CONSTRAINT "_homepage_v_blocks_insights_section_link_file_id_media_id_fk" FOREIGN KEY ("section_link_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_insights" ADD CONSTRAINT "_homepage_v_blocks_insights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_cta_band_buttons" ADD CONSTRAINT "_homepage_v_blocks_cta_band_buttons_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_cta_band_buttons" ADD CONSTRAINT "_homepage_v_blocks_cta_band_buttons_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_cta_band_buttons" ADD CONSTRAINT "_homepage_v_blocks_cta_band_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_blocks_cta_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_cta_band" ADD CONSTRAINT "_homepage_v_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_partners" ADD CONSTRAINT "_homepage_v_blocks_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_blocks_contact" ADD CONSTRAINT "_homepage_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_items_children" ADD CONSTRAINT "navigation_items_children_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_items_children" ADD CONSTRAINT "navigation_items_children_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_items_children" ADD CONSTRAINT "navigation_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation" ADD CONSTRAINT "navigation_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation" ADD CONSTRAINT "navigation_cta_file_id_media_id_fk" FOREIGN KEY ("cta_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_regulatory_lines" ADD CONSTRAINT "footer_regulatory_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_complaints_pdf_id_media_id_fk" FOREIGN KEY ("complaints_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_utility_bar_links" ADD CONSTRAINT "site_settings_utility_bar_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_utility_bar_links" ADD CONSTRAINT "site_settings_utility_bar_links_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_utility_bar_links" ADD CONSTRAINT "site_settings_utility_bar_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_contact_addresses" ADD CONSTRAINT "site_settings_contact_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_seo_image_id_media_id_fk" FOREIGN KEY ("default_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_card_grid_cards_order_idx" ON "pages_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_cards_parent_id_idx" ON "pages_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_cards_image_idx" ON "pages_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_card_grid_cards_link_link_page_idx" ON "pages_blocks_card_grid_cards" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_card_grid_cards_link_link_file_idx" ON "pages_blocks_card_grid_cards" USING btree ("link_file_id");
  CREATE INDEX "pages_blocks_card_grid_order_idx" ON "pages_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_parent_id_idx" ON "pages_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_path_idx" ON "pages_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_file_list_files_order_idx" ON "pages_blocks_file_list_files" USING btree ("_order");
  CREATE INDEX "pages_blocks_file_list_files_parent_id_idx" ON "pages_blocks_file_list_files" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_file_list_files_file_idx" ON "pages_blocks_file_list_files" USING btree ("file_id");
  CREATE INDEX "pages_blocks_file_list_order_idx" ON "pages_blocks_file_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_file_list_parent_id_idx" ON "pages_blocks_file_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_file_list_path_idx" ON "pages_blocks_file_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_list_order_idx" ON "pages_blocks_team_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_list_parent_id_idx" ON "pages_blocks_team_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_list_path_idx" ON "pages_blocks_team_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_band_buttons_order_idx" ON "pages_blocks_cta_band_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_band_buttons_parent_id_idx" ON "pages_blocks_cta_band_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_band_buttons_page_idx" ON "pages_blocks_cta_band_buttons" USING btree ("page_id");
  CREATE INDEX "pages_blocks_cta_band_buttons_file_idx" ON "pages_blocks_cta_band_buttons" USING btree ("file_id");
  CREATE INDEX "pages_blocks_cta_band_order_idx" ON "pages_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_band_parent_id_idx" ON "pages_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_band_path_idx" ON "pages_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_buttons_buttons_order_idx" ON "pages_blocks_buttons_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_buttons_buttons_parent_id_idx" ON "pages_blocks_buttons_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_buttons_buttons_page_idx" ON "pages_blocks_buttons_buttons" USING btree ("page_id");
  CREATE INDEX "pages_blocks_buttons_buttons_file_idx" ON "pages_blocks_buttons_buttons" USING btree ("file_id");
  CREATE INDEX "pages_blocks_buttons_order_idx" ON "pages_blocks_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_buttons_parent_id_idx" ON "pages_blocks_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_buttons_path_idx" ON "pages_blocks_buttons" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_order_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_parent_id_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_image_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_link_link_page_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_link_link_file_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("link_file_id");
  CREATE INDEX "_pages_v_blocks_card_grid_order_idx" ON "_pages_v_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_parent_id_idx" ON "_pages_v_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_path_idx" ON "_pages_v_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_file_list_files_order_idx" ON "_pages_v_blocks_file_list_files" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_file_list_files_parent_id_idx" ON "_pages_v_blocks_file_list_files" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_file_list_files_file_idx" ON "_pages_v_blocks_file_list_files" USING btree ("file_id");
  CREATE INDEX "_pages_v_blocks_file_list_order_idx" ON "_pages_v_blocks_file_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_file_list_parent_id_idx" ON "_pages_v_blocks_file_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_file_list_path_idx" ON "_pages_v_blocks_file_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_list_order_idx" ON "_pages_v_blocks_team_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_list_parent_id_idx" ON "_pages_v_blocks_team_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_list_path_idx" ON "_pages_v_blocks_team_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_band_buttons_order_idx" ON "_pages_v_blocks_cta_band_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_band_buttons_parent_id_idx" ON "_pages_v_blocks_cta_band_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_band_buttons_page_idx" ON "_pages_v_blocks_cta_band_buttons" USING btree ("page_id");
  CREATE INDEX "_pages_v_blocks_cta_band_buttons_file_idx" ON "_pages_v_blocks_cta_band_buttons" USING btree ("file_id");
  CREATE INDEX "_pages_v_blocks_cta_band_order_idx" ON "_pages_v_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_band_parent_id_idx" ON "_pages_v_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_band_path_idx" ON "_pages_v_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_buttons_buttons_order_idx" ON "_pages_v_blocks_buttons_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_buttons_buttons_parent_id_idx" ON "_pages_v_blocks_buttons_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_buttons_buttons_page_idx" ON "_pages_v_blocks_buttons_buttons" USING btree ("page_id");
  CREATE INDEX "_pages_v_blocks_buttons_buttons_file_idx" ON "_pages_v_blocks_buttons_buttons" USING btree ("file_id");
  CREATE INDEX "_pages_v_blocks_buttons_order_idx" ON "_pages_v_blocks_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_buttons_parent_id_idx" ON "_pages_v_blocks_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_buttons_path_idx" ON "_pages_v_blocks_buttons" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_seo_version_seo_image_idx" ON "_pages_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "services_page_idx" ON "services" USING btree ("page_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "transactions_practice_idx" ON "transactions" USING btree ("practice_id");
  CREATE INDEX "transactions_logo_idx" ON "transactions" USING btree ("logo_id");
  CREATE INDEX "transactions_updated_at_idx" ON "transactions" USING btree ("updated_at");
  CREATE INDEX "transactions_created_at_idx" ON "transactions" USING btree ("created_at");
  CREATE INDEX "team_members_portrait_idx" ON "team_members" USING btree ("portrait_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "announcements_file_idx" ON "announcements" USING btree ("file_id");
  CREATE INDEX "announcements_updated_at_idx" ON "announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at");
  CREATE INDEX "corporate_reports_file_idx" ON "corporate_reports" USING btree ("file_id");
  CREATE INDEX "corporate_reports_updated_at_idx" ON "corporate_reports" USING btree ("updated_at");
  CREATE INDEX "corporate_reports_created_at_idx" ON "corporate_reports" USING btree ("created_at");
  CREATE INDEX "static_financial_statements_file_idx" ON "static_financial_statements" USING btree ("file_id");
  CREATE INDEX "static_financial_statements_updated_at_idx" ON "static_financial_statements" USING btree ("updated_at");
  CREATE INDEX "static_financial_statements_created_at_idx" ON "static_financial_statements" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "audit_log_user_idx" ON "audit_log" USING btree ("user_id");
  CREATE INDEX "audit_log_updated_at_idx" ON "audit_log" USING btree ("updated_at");
  CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("transactions_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("announcements_id");
  CREATE INDEX "payload_locked_documents_rels_corporate_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("corporate_reports_id");
  CREATE INDEX "payload_locked_documents_rels_static_financial_statement_idx" ON "payload_locked_documents_rels" USING btree ("static_financial_statements_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_audit_log_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_log_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_blocks_hero_buttons_order_idx" ON "homepage_blocks_hero_buttons" USING btree ("_order");
  CREATE INDEX "homepage_blocks_hero_buttons_parent_id_idx" ON "homepage_blocks_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_hero_buttons_page_idx" ON "homepage_blocks_hero_buttons" USING btree ("page_id");
  CREATE INDEX "homepage_blocks_hero_buttons_file_idx" ON "homepage_blocks_hero_buttons" USING btree ("file_id");
  CREATE INDEX "homepage_blocks_hero_stats_order_idx" ON "homepage_blocks_hero_stats" USING btree ("_order");
  CREATE INDEX "homepage_blocks_hero_stats_parent_id_idx" ON "homepage_blocks_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_hero_order_idx" ON "homepage_blocks_hero" USING btree ("_order");
  CREATE INDEX "homepage_blocks_hero_parent_id_idx" ON "homepage_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_hero_path_idx" ON "homepage_blocks_hero" USING btree ("_path");
  CREATE INDEX "homepage_blocks_services_order_idx" ON "homepage_blocks_services" USING btree ("_order");
  CREATE INDEX "homepage_blocks_services_parent_id_idx" ON "homepage_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_services_path_idx" ON "homepage_blocks_services" USING btree ("_path");
  CREATE INDEX "homepage_blocks_transactions_order_idx" ON "homepage_blocks_transactions" USING btree ("_order");
  CREATE INDEX "homepage_blocks_transactions_parent_id_idx" ON "homepage_blocks_transactions" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_transactions_path_idx" ON "homepage_blocks_transactions" USING btree ("_path");
  CREATE INDEX "homepage_blocks_transactions_section_link_section_link_p_idx" ON "homepage_blocks_transactions" USING btree ("section_link_page_id");
  CREATE INDEX "homepage_blocks_transactions_section_link_section_link_f_idx" ON "homepage_blocks_transactions" USING btree ("section_link_file_id");
  CREATE INDEX "homepage_blocks_process_steps_order_idx" ON "homepage_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "homepage_blocks_process_steps_parent_id_idx" ON "homepage_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_process_order_idx" ON "homepage_blocks_process" USING btree ("_order");
  CREATE INDEX "homepage_blocks_process_parent_id_idx" ON "homepage_blocks_process" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_process_path_idx" ON "homepage_blocks_process" USING btree ("_path");
  CREATE INDEX "homepage_blocks_team_order_idx" ON "homepage_blocks_team" USING btree ("_order");
  CREATE INDEX "homepage_blocks_team_parent_id_idx" ON "homepage_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_team_path_idx" ON "homepage_blocks_team" USING btree ("_path");
  CREATE INDEX "homepage_blocks_team_section_link_section_link_page_idx" ON "homepage_blocks_team" USING btree ("section_link_page_id");
  CREATE INDEX "homepage_blocks_team_section_link_section_link_file_idx" ON "homepage_blocks_team" USING btree ("section_link_file_id");
  CREATE INDEX "homepage_blocks_insights_items_order_idx" ON "homepage_blocks_insights_items" USING btree ("_order");
  CREATE INDEX "homepage_blocks_insights_items_parent_id_idx" ON "homepage_blocks_insights_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_insights_order_idx" ON "homepage_blocks_insights" USING btree ("_order");
  CREATE INDEX "homepage_blocks_insights_parent_id_idx" ON "homepage_blocks_insights" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_insights_path_idx" ON "homepage_blocks_insights" USING btree ("_path");
  CREATE INDEX "homepage_blocks_insights_section_link_section_link_page_idx" ON "homepage_blocks_insights" USING btree ("section_link_page_id");
  CREATE INDEX "homepage_blocks_insights_section_link_section_link_file_idx" ON "homepage_blocks_insights" USING btree ("section_link_file_id");
  CREATE INDEX "homepage_blocks_cta_band_buttons_order_idx" ON "homepage_blocks_cta_band_buttons" USING btree ("_order");
  CREATE INDEX "homepage_blocks_cta_band_buttons_parent_id_idx" ON "homepage_blocks_cta_band_buttons" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_cta_band_buttons_page_idx" ON "homepage_blocks_cta_band_buttons" USING btree ("page_id");
  CREATE INDEX "homepage_blocks_cta_band_buttons_file_idx" ON "homepage_blocks_cta_band_buttons" USING btree ("file_id");
  CREATE INDEX "homepage_blocks_cta_band_order_idx" ON "homepage_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "homepage_blocks_cta_band_parent_id_idx" ON "homepage_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_cta_band_path_idx" ON "homepage_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "homepage_blocks_partners_order_idx" ON "homepage_blocks_partners" USING btree ("_order");
  CREATE INDEX "homepage_blocks_partners_parent_id_idx" ON "homepage_blocks_partners" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_partners_path_idx" ON "homepage_blocks_partners" USING btree ("_path");
  CREATE INDEX "homepage_blocks_contact_order_idx" ON "homepage_blocks_contact" USING btree ("_order");
  CREATE INDEX "homepage_blocks_contact_parent_id_idx" ON "homepage_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_contact_path_idx" ON "homepage_blocks_contact" USING btree ("_path");
  CREATE INDEX "homepage_seo_seo_image_idx" ON "homepage" USING btree ("seo_image_id");
  CREATE INDEX "_homepage_v_blocks_hero_buttons_order_idx" ON "_homepage_v_blocks_hero_buttons" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_hero_buttons_parent_id_idx" ON "_homepage_v_blocks_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_hero_buttons_page_idx" ON "_homepage_v_blocks_hero_buttons" USING btree ("page_id");
  CREATE INDEX "_homepage_v_blocks_hero_buttons_file_idx" ON "_homepage_v_blocks_hero_buttons" USING btree ("file_id");
  CREATE INDEX "_homepage_v_blocks_hero_stats_order_idx" ON "_homepage_v_blocks_hero_stats" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_hero_stats_parent_id_idx" ON "_homepage_v_blocks_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_hero_order_idx" ON "_homepage_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_hero_parent_id_idx" ON "_homepage_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_hero_path_idx" ON "_homepage_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_services_order_idx" ON "_homepage_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_services_parent_id_idx" ON "_homepage_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_services_path_idx" ON "_homepage_v_blocks_services" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_transactions_order_idx" ON "_homepage_v_blocks_transactions" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_transactions_parent_id_idx" ON "_homepage_v_blocks_transactions" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_transactions_path_idx" ON "_homepage_v_blocks_transactions" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_transactions_section_link_section_lin_idx" ON "_homepage_v_blocks_transactions" USING btree ("section_link_page_id");
  CREATE INDEX "_homepage_v_blocks_transactions_section_link_section_l_1_idx" ON "_homepage_v_blocks_transactions" USING btree ("section_link_file_id");
  CREATE INDEX "_homepage_v_blocks_process_steps_order_idx" ON "_homepage_v_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_process_steps_parent_id_idx" ON "_homepage_v_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_process_order_idx" ON "_homepage_v_blocks_process" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_process_parent_id_idx" ON "_homepage_v_blocks_process" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_process_path_idx" ON "_homepage_v_blocks_process" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_team_order_idx" ON "_homepage_v_blocks_team" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_team_parent_id_idx" ON "_homepage_v_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_team_path_idx" ON "_homepage_v_blocks_team" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_team_section_link_section_link_page_idx" ON "_homepage_v_blocks_team" USING btree ("section_link_page_id");
  CREATE INDEX "_homepage_v_blocks_team_section_link_section_link_file_idx" ON "_homepage_v_blocks_team" USING btree ("section_link_file_id");
  CREATE INDEX "_homepage_v_blocks_insights_items_order_idx" ON "_homepage_v_blocks_insights_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_insights_items_parent_id_idx" ON "_homepage_v_blocks_insights_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_insights_order_idx" ON "_homepage_v_blocks_insights" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_insights_parent_id_idx" ON "_homepage_v_blocks_insights" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_insights_path_idx" ON "_homepage_v_blocks_insights" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_insights_section_link_section_link_pa_idx" ON "_homepage_v_blocks_insights" USING btree ("section_link_page_id");
  CREATE INDEX "_homepage_v_blocks_insights_section_link_section_link_fi_idx" ON "_homepage_v_blocks_insights" USING btree ("section_link_file_id");
  CREATE INDEX "_homepage_v_blocks_cta_band_buttons_order_idx" ON "_homepage_v_blocks_cta_band_buttons" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_cta_band_buttons_parent_id_idx" ON "_homepage_v_blocks_cta_band_buttons" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_cta_band_buttons_page_idx" ON "_homepage_v_blocks_cta_band_buttons" USING btree ("page_id");
  CREATE INDEX "_homepage_v_blocks_cta_band_buttons_file_idx" ON "_homepage_v_blocks_cta_band_buttons" USING btree ("file_id");
  CREATE INDEX "_homepage_v_blocks_cta_band_order_idx" ON "_homepage_v_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_cta_band_parent_id_idx" ON "_homepage_v_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_cta_band_path_idx" ON "_homepage_v_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_partners_order_idx" ON "_homepage_v_blocks_partners" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_partners_parent_id_idx" ON "_homepage_v_blocks_partners" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_partners_path_idx" ON "_homepage_v_blocks_partners" USING btree ("_path");
  CREATE INDEX "_homepage_v_blocks_contact_order_idx" ON "_homepage_v_blocks_contact" USING btree ("_order");
  CREATE INDEX "_homepage_v_blocks_contact_parent_id_idx" ON "_homepage_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_blocks_contact_path_idx" ON "_homepage_v_blocks_contact" USING btree ("_path");
  CREATE INDEX "_homepage_v_version_seo_version_seo_image_idx" ON "_homepage_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "navigation_items_children_order_idx" ON "navigation_items_children" USING btree ("_order");
  CREATE INDEX "navigation_items_children_parent_id_idx" ON "navigation_items_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_items_children_page_idx" ON "navigation_items_children" USING btree ("page_id");
  CREATE INDEX "navigation_items_children_file_idx" ON "navigation_items_children" USING btree ("file_id");
  CREATE INDEX "navigation_items_order_idx" ON "navigation_items" USING btree ("_order");
  CREATE INDEX "navigation_items_parent_id_idx" ON "navigation_items" USING btree ("_parent_id");
  CREATE INDEX "navigation_items_page_idx" ON "navigation_items" USING btree ("page_id");
  CREATE INDEX "navigation_items_file_idx" ON "navigation_items" USING btree ("file_id");
  CREATE INDEX "navigation_cta_cta_page_idx" ON "navigation" USING btree ("cta_page_id");
  CREATE INDEX "navigation_cta_cta_file_idx" ON "navigation" USING btree ("cta_file_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_page_idx" ON "footer_columns_links" USING btree ("page_id");
  CREATE INDEX "footer_columns_links_file_idx" ON "footer_columns_links" USING btree ("file_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_regulatory_lines_order_idx" ON "footer_regulatory_lines" USING btree ("_order");
  CREATE INDEX "footer_regulatory_lines_parent_id_idx" ON "footer_regulatory_lines" USING btree ("_parent_id");
  CREATE INDEX "footer_complaints_complaints_pdf_idx" ON "footer" USING btree ("complaints_pdf_id");
  CREATE INDEX "site_settings_utility_bar_links_order_idx" ON "site_settings_utility_bar_links" USING btree ("_order");
  CREATE INDEX "site_settings_utility_bar_links_parent_id_idx" ON "site_settings_utility_bar_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_utility_bar_links_page_idx" ON "site_settings_utility_bar_links" USING btree ("page_id");
  CREATE INDEX "site_settings_utility_bar_links_file_idx" ON "site_settings_utility_bar_links" USING btree ("file_id");
  CREATE INDEX "site_settings_contact_addresses_order_idx" ON "site_settings_contact_addresses" USING btree ("_order");
  CREATE INDEX "site_settings_contact_addresses_parent_id_idx" ON "site_settings_contact_addresses" USING btree ("_parent_id");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_default_seo_default_seo_image_idx" ON "site_settings" USING btree ("default_seo_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_card_grid_cards" CASCADE;
  DROP TABLE "pages_blocks_card_grid" CASCADE;
  DROP TABLE "pages_blocks_file_list_files" CASCADE;
  DROP TABLE "pages_blocks_file_list" CASCADE;
  DROP TABLE "pages_blocks_team_list" CASCADE;
  DROP TABLE "pages_blocks_cta_band_buttons" CASCADE;
  DROP TABLE "pages_blocks_cta_band" CASCADE;
  DROP TABLE "pages_blocks_buttons_buttons" CASCADE;
  DROP TABLE "pages_blocks_buttons" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_file_list_files" CASCADE;
  DROP TABLE "_pages_v_blocks_file_list" CASCADE;
  DROP TABLE "_pages_v_blocks_team_list" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band" CASCADE;
  DROP TABLE "_pages_v_blocks_buttons_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_buttons" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "transactions" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "announcements" CASCADE;
  DROP TABLE "corporate_reports" CASCADE;
  DROP TABLE "static_financial_statements" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "audit_log" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_blocks_hero_buttons" CASCADE;
  DROP TABLE "homepage_blocks_hero_stats" CASCADE;
  DROP TABLE "homepage_blocks_hero" CASCADE;
  DROP TABLE "homepage_blocks_services" CASCADE;
  DROP TABLE "homepage_blocks_transactions" CASCADE;
  DROP TABLE "homepage_blocks_process_steps" CASCADE;
  DROP TABLE "homepage_blocks_process" CASCADE;
  DROP TABLE "homepage_blocks_team" CASCADE;
  DROP TABLE "homepage_blocks_insights_items" CASCADE;
  DROP TABLE "homepage_blocks_insights" CASCADE;
  DROP TABLE "homepage_blocks_cta_band_buttons" CASCADE;
  DROP TABLE "homepage_blocks_cta_band" CASCADE;
  DROP TABLE "homepage_blocks_partners" CASCADE;
  DROP TABLE "homepage_blocks_contact" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "_homepage_v_blocks_hero_buttons" CASCADE;
  DROP TABLE "_homepage_v_blocks_hero_stats" CASCADE;
  DROP TABLE "_homepage_v_blocks_hero" CASCADE;
  DROP TABLE "_homepage_v_blocks_services" CASCADE;
  DROP TABLE "_homepage_v_blocks_transactions" CASCADE;
  DROP TABLE "_homepage_v_blocks_process_steps" CASCADE;
  DROP TABLE "_homepage_v_blocks_process" CASCADE;
  DROP TABLE "_homepage_v_blocks_team" CASCADE;
  DROP TABLE "_homepage_v_blocks_insights_items" CASCADE;
  DROP TABLE "_homepage_v_blocks_insights" CASCADE;
  DROP TABLE "_homepage_v_blocks_cta_band_buttons" CASCADE;
  DROP TABLE "_homepage_v_blocks_cta_band" CASCADE;
  DROP TABLE "_homepage_v_blocks_partners" CASCADE;
  DROP TABLE "_homepage_v_blocks_contact" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "navigation_items_children" CASCADE;
  DROP TABLE "navigation_items" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_regulatory_lines" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "site_settings_utility_bar_links" CASCADE;
  DROP TABLE "site_settings_contact_addresses" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_card_grid_cards_link_type";
  DROP TYPE "public"."enum_pages_blocks_card_grid_background";
  DROP TYPE "public"."enum_pages_blocks_team_list_group";
  DROP TYPE "public"."enum_pages_blocks_cta_band_buttons_type";
  DROP TYPE "public"."enum_pages_blocks_cta_band_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_buttons_buttons_type";
  DROP TYPE "public"."enum_pages_blocks_buttons_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_cards_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_background";
  DROP TYPE "public"."enum__pages_v_blocks_team_list_group";
  DROP TYPE "public"."enum__pages_v_blocks_cta_band_buttons_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_band_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_buttons_buttons_type";
  DROP TYPE "public"."enum__pages_v_blocks_buttons_buttons_style";
  DROP TYPE "public"."enum_team_members_group";
  DROP TYPE "public"."enum_static_financial_statements_tab";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_audit_log_action";
  DROP TYPE "public"."enum_homepage_blocks_hero_buttons_type";
  DROP TYPE "public"."enum_homepage_blocks_hero_buttons_style";
  DROP TYPE "public"."enum_homepage_blocks_transactions_section_link_type";
  DROP TYPE "public"."enum_homepage_blocks_process_steps_color";
  DROP TYPE "public"."enum_homepage_blocks_team_section_link_type";
  DROP TYPE "public"."enum_homepage_blocks_insights_section_link_type";
  DROP TYPE "public"."enum_homepage_blocks_cta_band_buttons_type";
  DROP TYPE "public"."enum_homepage_blocks_cta_band_buttons_style";
  DROP TYPE "public"."enum__homepage_v_blocks_hero_buttons_type";
  DROP TYPE "public"."enum__homepage_v_blocks_hero_buttons_style";
  DROP TYPE "public"."enum__homepage_v_blocks_transactions_section_link_type";
  DROP TYPE "public"."enum__homepage_v_blocks_process_steps_color";
  DROP TYPE "public"."enum__homepage_v_blocks_team_section_link_type";
  DROP TYPE "public"."enum__homepage_v_blocks_insights_section_link_type";
  DROP TYPE "public"."enum__homepage_v_blocks_cta_band_buttons_type";
  DROP TYPE "public"."enum__homepage_v_blocks_cta_band_buttons_style";
  DROP TYPE "public"."enum_navigation_items_children_type";
  DROP TYPE "public"."enum_navigation_items_type";
  DROP TYPE "public"."enum_navigation_cta_type";
  DROP TYPE "public"."enum_footer_columns_links_type";
  DROP TYPE "public"."enum_site_settings_utility_bar_links_type";`)
}
