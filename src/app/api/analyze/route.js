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

    const analysis = await analyzeReportWithGemini({
      fileBuffer,
      mimeType: file.type,
      fileName: file.name,
    });

    await saveReportAnalysis(reportId, analysis);

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
        message: dbError?.message,
      });
    }

    const response = errorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}
