import { ObjectId } from "mongodb";
import { getMongoDb } from "@/db/mongodb";

const COLLECTION = "reports";

export async function createReportRecord({ fileName, mimeType, fileSize }) {
  const db = await getMongoDb();
  const now = new Date();
  const result = await db.collection(COLLECTION).insertOne({
    originalFilename: fileName,
    mimeType,
    fileSize,
    uploadTimestamp: now,
    processingStatus: "processing",
    analysisStatus: "pending",
    geminiAnalysis: null,
    analysisTimestamp: null,
    error: null,
    createdAt: now,
    updatedAt: now,
  });

  return result.insertedId.toString();
}

export async function saveReportAnalysis(reportId, analysis) {
  const db = await getMongoDb();
  const now = new Date();
  await db.collection(COLLECTION).updateOne(
    { _id: toObjectId(reportId) },
    {
      $set: {
        processingStatus: analysis.status === "success" ? "complete" : "needs_review",
        analysisStatus: analysis.status,
        geminiAnalysis: analysis,
        analysisTimestamp: now,
        error: null,
        updatedAt: now,
      },
    }
  );
}

export async function saveReportError(reportId, error) {
  if (!reportId) return;
  const db = await getMongoDb();
  await db.collection(COLLECTION).updateOne(
    { _id: toObjectId(reportId) },
    {
      $set: {
        processingStatus: "failed",
        analysisStatus: "error",
        error: {
          code: error?.code || "processing_error",
          message: error?.message || "Report processing failed.",
        },
        updatedAt: new Date(),
      },
    }
  );
}

function toObjectId(id) {
  return new ObjectId(id);
}
