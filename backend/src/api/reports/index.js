import { ObjectId } from "mongodb";
import { getMongoDb } from "../../database/mongodb.js";

export async function getReportHandler(req, res) {
  try {
    const db = await getMongoDb();
    const report = await db.collection("reports").findOne({ _id: new ObjectId(req.params.id) });
    if (!report) return res.status(404).json({ success: false, error: "Saved report not found." });
    return res.json({ success: true, data: { reportId: report._id.toString(), fileName: report.originalFilename, reportName: report.originalFilename, saved: true, ...(report.geminiAnalysis || {}) } });
  } catch {
    return res.status(400).json({ success: false, error: "Saved report could not be opened." });
  }
}
