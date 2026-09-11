import { NextResponse } from "next/server";
import { analyzeReport } from "@/lib/ai-service";

export async function POST(req) {
  try {
    const body = await req.json();
    const result = analyzeReport({
      fileName: body.fileName,
      fileType: body.fileType,
      reportText: body.reportText,
    });

    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json(
      { success: false, error: "Analysis failed" },
      { status: 500 }
    );
  }
}
