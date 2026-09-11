CREATE TABLE "medical_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"file_type" text NOT NULL,
	"report_type" text NOT NULL,
	"summary_en" text NOT NULL,
	"summary_ne" text NOT NULL,
	"status_counts" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medical_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"report_id" integer NOT NULL,
	"test_name" text NOT NULL,
	"value" text NOT NULL,
	"numeric_value" text,
	"unit" text,
	"reference_range" text,
	"status" text NOT NULL,
	"explanation_en" text NOT NULL,
	"explanation_ne" text NOT NULL,
	"guidance_en" text NOT NULL,
	"guidance_ne" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "medical_results" ADD CONSTRAINT "medical_results_report_id_medical_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."medical_reports"("id") ON DELETE cascade ON UPDATE no action;