import { NextRequest, NextResponse } from "next/server";
import { analyzeReport } from "@/lib/ai-service";

export async function POST(req) {
  try {
    const body = await req.json();
    const result = analyzeReport(body.fileType || "image");
    // Simulate AI delay
    await new Promise((r) => setTimeout(r, 1200));
    return NextResponse.json({ success: true, data: result });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Analysis failed" }, { status: 500 });
  }
}
