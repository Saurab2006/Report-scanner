import { NextResponse } from "next/server";
import { saveAnalysis } from "@/db/reports";
import { analyzeReport } from "@/lib/ai-service";

export async function POST(req) {
  try {
    const body = await req.json();
    const result = analyzeReport({
      fileName: body.fileName,
      fileType: body.fileType,
      reportText: body.reportText,
    });
    const savedReport = await saveAnalysis(result, body.fileType);

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        saved: savedReport.saved,
        reportId: savedReport.reportId,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Analysis failed" },
      { status: 500 }
    );
  }
}
