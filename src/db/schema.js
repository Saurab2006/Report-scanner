import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const medicalReports = pgTable("medical_reports", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  reportType: text("report_type").notNull(),
  summaryEn: text("summary_en").notNull(),
  summaryNe: text("summary_ne").notNull(),
  statusCounts: jsonb("status_counts").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const medicalResults = pgTable("medical_results", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id")
    .notNull()
    .references(() => medicalReports.id, { onDelete: "cascade" }),
  testName: text("test_name").notNull(),
  value: text("value").notNull(),
  numericValue: text("numeric_value"),
  unit: text("unit"),
  referenceRange: text("reference_range"),
  status: text("status").notNull(),
  explanationEn: text("explanation_en").notNull(),
  explanationNe: text("explanation_ne").notNull(),
  guidanceEn: text("guidance_en").notNull(),
  guidanceNe: text("guidance_ne").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
