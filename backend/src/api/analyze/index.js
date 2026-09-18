import { analyzeReportWithGemini } from "../../services/gemini-service.js";
import { validateUploadedFile } from "../../utils/file-validation.js";
import { errorResponse } from "../../utils/errors.js";
import { createReportRecord, saveReportAnalysis, saveReportError } from "../../database/reports.js";

export async function analyzeHandler(req, res) {
  let reportId = null;
  let persistenceWarning = null;
  try {
    const file = req.file;
    const fileBuffer = validateUploadedFile(file);
    try {
      reportId = await createReportRecord({ fileName: file.originalname, mimeType: file.mimetype, fileSize: file.size });
    } catch (error) {
      if (!isMongoAvailabilityError(error)) throw error;
      persistenceWarning = "Analysis completed, but the result could not be saved because MongoDB is unavailable.";
    }
    const analysis = await analyzeReportWithGemini({ fileBuffer, mimeType: file.mimetype, fileName: file.originalname });
    if (reportId) {
      try { await saveReportAnalysis(reportId, analysis); }
      catch (error) {
        if (!isMongoAvailabilityError(error)) throw error;
        persistenceWarning = "Analysis completed, but the result could not be saved because MongoDB is unavailable.";
      }
    }
    return res.json({ success: true, data: { reportId, fileName: file.originalname, mimeType: file.mimetype, fileSize: file.size, ...analysis, saved: Boolean(reportId) && !persistenceWarning, ...(persistenceWarning ? { persistenceWarning } : {}) } });
  } catch (error) {
    try { await saveReportError(reportId, error); } catch {}
    const response = errorResponse(error);
    return res.status(response.status).json(response.body);
  }
}

function isMongoAvailabilityError(error) {
  return ["mongodb_not_configured", "mongodb_connection_failed"].includes(error?.code);
}
