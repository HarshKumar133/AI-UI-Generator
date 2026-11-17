CREATE TABLE "project_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"prompt" text NOT NULL,
	"source" text NOT NULL,
	"source_type" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"title" text NOT NULL,
	"source_type" text DEFAULT 'tsx' NOT NULL,
	"current_version" integer DEFAULT 0 NOT NULL,
	"share_enabled" boolean DEFAULT false NOT NULL,
	"share_token" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_share_token_unique" UNIQUE("share_token")
);
--> statement-breakpoint
ALTER TABLE "project_messages" ADD CONSTRAINT "project_messages_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_versions" ADD CONSTRAINT "project_versions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_messages_project_created_idx" ON "project_messages" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "project_versions_project_number_idx" ON "project_versions" USING btree ("project_id","version_number");--> statement-breakpoint
CREATE INDEX "project_versions_project_created_idx" ON "project_versions" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "projects_owner_updated_idx" ON "projects" USING btree ("owner_id","updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_share_token_idx" ON "projects" USING btree ("share_token");