import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/errors";
import { analyzeReportWithGemini } from "@/lib/gemini-service";
import { validateUploadedFile } from "@/lib/file-validation";
import { createReportRecord, saveReportAnalysis, saveReportError } from "@/db/reports";

export const runtime = "nodejs";

export async function POST(req) {
  let reportId = null;
  let persistenceWarning = null;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const fileBuffer = await validateUploadedFile(file);

    try {
      reportId = await createReportRecord({
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
      });
    } catch (error) {
      if (!isMongoAvailabilityError(error)) throw error;
      persistenceWarning = "Analysis completed, but the result could not be saved because MongoDB is unavailable.";
      console.warn("[ReportScan] Continuing without MongoDB persistence", {
        code: error?.code,
        message: error?.message,
      });
    }

    console.info(`[ReportScan] Processing report ${reportId || "without persistence"}: ${file.name}`);

    const analysis = await analyzeReportWithGemini({
      fileBuffer,
      mimeType: file.type,
      fileName: file.name,
    });

    if (reportId) {
      try {
        await saveReportAnalysis(reportId, analysis);
      } catch (error) {
        if (!isMongoAvailabilityError(error)) throw error;
        persistenceWarning = "Analysis completed, but the result could not be saved because MongoDB is unavailable.";
        console.warn("[ReportScan] Analysis completed without MongoDB persistence", {
          reportId,
          code: error?.code,
          message: error?.message,
        });
      }
    }

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
        saved: Boolean(reportId) && !persistenceWarning,
        ...(persistenceWarning ? { persistenceWarning } : {}),
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

function isMongoAvailabilityError(error) {
  return ["mongodb_not_configured", "mongodb_connection_failed"].includes(error?.code);
}
