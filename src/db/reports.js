import { db, hasDatabase } from "@/db";
import { medicalReports, medicalResults } from "@/db/schema";

export async function saveAnalysis(analysis, fileType) {
  if (!hasDatabase) {
    return { saved: false, reportId: null };
  }

  try {
    const [report] = await db
      .insert(medicalReports)
      .values({
        fileName: analysis.reportName,
        fileType: fileType || "",
        reportType: analysis.reportType,
        summaryEn: analysis.summaryEn,
        summaryNe: analysis.summaryNe,
        statusCounts: analysis.statusCounts,
      })
      .returning({ id: medicalReports.id });

    if (analysis.results.length > 0) {
      await db.insert(medicalResults).values(
        analysis.results.map((result) => ({
          reportId: report.id,
          testName: result.testName,
          value: result.value,
          numericValue:
            result.numericValue === null || result.numericValue === undefined
              ? null
              : String(result.numericValue),
          unit: result.unit || null,
          referenceRange: result.referenceRange || null,
          status: result.status,
          explanationEn: result.explanationEn,
          explanationNe: result.explanationNe,
          guidanceEn: result.guidanceEn,
          guidanceNe: result.guidanceNe,
        }))
      );
    }

    return { saved: true, reportId: report.id };
  } catch {
    return { saved: false, reportId: null };
  }
}
