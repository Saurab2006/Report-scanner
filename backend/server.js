import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import cors from "cors";
import { analyzeHandler } from "./src/api/analyze/index.js";
import { healthHandler } from "./src/api/health/index.js";
import { getReportHandler } from "./src/api/reports/index.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });
// Local secrets override shared/default configuration and must never be committed.
dotenv.config({ path: new URL("../.env.local", import.meta.url), override: true });

const app = express();
const port = Number(process.env.PORT || 5000);
const maxUploadMb = Math.max(1, Number(process.env.MAX_UPLOAD_MB || 15));
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxUploadMb * 1024 * 1024 } });

app.use(cors({
  origin(origin, callback) {
    // Allow the local Next.js app whether it is opened as localhost or 127.0.0.1.
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):3000$/.test(origin) || origin === process.env.FRONTEND_URL) return callback(null, true);
    return callback(new Error("This origin is not allowed to call ReportScan."));
  },
}));
app.get("/api/health", healthHandler);
app.post("/api/analyze", upload.single("file"), analyzeHandler);
app.get("/api/reports/:id", getReportHandler);
app.use((error, _req, res, _next) => {
  if (error?.code === "LIMIT_FILE_SIZE") return res.status(413).json({ success: false, code: "file_too_large", error: `The selected file is too large. Maximum allowed size is ${maxUploadMb} MB.` });
  return res.status(500).json({ success: false, code: "server_error", error: "Something went wrong while processing the report." });
});
app.listen(port, () => console.info(`[ReportScan] Backend listening on http://localhost:${port}`));
