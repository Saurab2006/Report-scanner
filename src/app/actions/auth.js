"use server";

import { db } from "@/db";
import { users, reports, results } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function hashPass(p) {
  // Simple demo hash - not production secure
  return Buffer.from(p).toString("base64");
}

export async function signup(formData) {
  const firstName = formData.get("firstName")?.toString() || "";
  const lastName = formData.get("lastName")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const lang = formData.get("preferredLanguage")?.toString() || "en";

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) throw new Error("Email already registered");

  const [user] = await db.insert(users).values({
    firstName,
    lastName,
    email,
    passwordHash: hashPass(password),
    preferredLanguage: lang,
  }).returning();

  const cookieStore = await cookies();
  cookieStore.set("swash_user_id", String(user.id), { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
  cookieStore.set("swash_lang", lang, { maxAge: 60 * 60 * 24 * 7, path: "/" });
  redirect("/dashboard");
}

export async function login(formData) {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length === 0 || existing[0].passwordHash !== hashPass(password)) {
    throw new Error("Invalid email or password");
  }

  const user = existing[0];
  const cookieStore = await cookies();
  cookieStore.set("swash_user_id", String(user.id), { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
  cookieStore.set("swash_lang", user.preferredLanguage || "en", { maxAge: 60 * 60 * 24 * 7, path: "/" });
  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("swash_user_id");
  cookieStore.delete("swash_lang");
  redirect("/");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("swash_user_id")?.value;
  if (!userId) return null;
  const user = await db.select().from(users).where(eq(users.id, parseInt(userId))).limit(1);
  return user[0] || null;
}

export async function getUserLang() {
  const cookieStore = await cookies();
  return cookieStore.get("swash_lang")?.value || "en";
}

export async function saveReport(formData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not logged in");

  const reportName = formData.get("reportName")?.toString() || "Report";
  const reportType = formData.get("reportType")?.toString() || "CBC";
  const summary = formData.get("summary")?.toString() || "";
  const statusCounts = JSON.parse(formData.get("statusCounts")?.toString() || "{}");

  const [report] = await db.insert(reports).values({
    userId: user.id,
    reportName,
    reportType,
    summary,
    statusCounts,
  }).returning();

  const resultsData = JSON.parse(formData.get("results")?.toString() || "[]");
  for (const r of resultsData) {
    await db.insert(results).values({
      reportId: report.id,
      testName: r.testName,
      value: r.value,
      numericValue: r.numericValue ?? null,
      unit: r.unit,
      referenceRange: r.referenceRange,
      status: r.status,
      explanationEn: r.explanationEn,
      explanationNe: r.explanationNe,
    });
  }

  return { id: report.id };
}
