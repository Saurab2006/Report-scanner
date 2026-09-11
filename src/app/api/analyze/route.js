import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/errors";
import { analyzeReportWithGemini } from "@/lib/gemini-service";
import { validateUploadedFile } from "@/lib/file-validation";
import { createReportRecord, saveReportAnalysis, saveReportError } from "@/db/reports";

export const runtime = "nodejs";

export async function POST(req) {
  let reportId = null;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const fileBuffer = await validateUploadedFile(file);

    reportId = await createReportRecord({
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
    });

    console.info(`[ReportScan] Processing report ${reportId}: ${file.name}`);

    const analysis = await analyzeReportWithGemini({
      fileBuffer,
      mimeType: file.type,
      fileName: file.name,
    });

    await saveReportAnalysis(reportId, analysis);

    console.info(`[ReportScan] Report ${reportId} analysis complete`, {
      status: analysis.status,
      resultCount: analysis.results?.length || 0,
    });

    return NextResponse.json({
      success: true,
      data: {
        reportId,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        ...analysis,
        saved: true,
      },
    });
  } catch (error) {
    try {
      await saveReportError(reportId, error);
    } catch (dbError) {
      console.error("[ReportScan] Failed to save report error state", {
        reportId,
        message: dbError?.message,
      });
    }

    const response = errorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}
