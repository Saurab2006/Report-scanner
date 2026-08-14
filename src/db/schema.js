import { pgTable, serial, text, timestamp, integer, real, boolean, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  preferredLanguage: text("preferred_language").notNull().default("en"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  reportName: text("report_name").notNull(),
  reportType: text("report_type").notNull().default("CBC"),
  reportDate: timestamp("report_date", { withTimezone: true }).defaultNow().notNull(),
  originalFileName: text("original_file_name"),
  summary: text("summary"),
  statusCounts: jsonb("status_counts"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  testName: text("test_name").notNull(),
  value: text("value").notNull(),
  numericValue: real("numeric_value"),
  unit: text("unit"),
  referenceRange: text("reference_range"),
  status: text("status").notNull(), // normal, high, low, unknown
  explanationEn: text("explanation_en"),
  explanationNe: text("explanation_ne"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
