import { NextResponse } from "next/server";
import { checkMongoConnection, getMongoStatus } from "@/db/mongodb";
import { getGeminiStatus } from "@/lib/gemini-service";

export const runtime = "nodejs";

export async function GET() {
  const mongoStatus = getMongoStatus();
  const geminiStatus = getGeminiStatus();
  const mongodb = mongoStatus.configured ? await checkMongoConnection() : "not_configured";

  return NextResponse.json({
    server: "ok",
    mongodb,
    gemini: geminiStatus.configured ? "configured" : "not_configured",
    model: geminiStatus.configured ? geminiStatus.model : null,
  });
}
