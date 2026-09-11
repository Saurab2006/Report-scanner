import { GoogleGenAI, Type } from "@google/genai";
import { AppError } from "@/lib/errors";

const DEFAULT_MODEL = "gemini-2.5-flash";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    status: { type: Type.STRING, enum: ["success", "unreadable"] },
    summary: { type: Type.STRING },
    reportSummary: { type: Type.STRING },
    confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
    results: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          testName: { type: Type.STRING },
          value: { type: Type.STRING },
          unit: { type: Type.STRING },
          referenceRange: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["high", "normal", "low", "needs_review", "unknown"] },
          explanation: { type: Type.STRING },
        },
        required: ["testName", "value", "unit", "referenceRange", "status", "explanation"],
      },
    },
    abnormalFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
    normalFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: [
    "status",
    "summary",
    "reportSummary",
    "confidence",
    "results",
    "abnormalFindings",
    "normalFindings",
    "recommendations",
  ],
};

export function getGeminiStatus() {
  return {
    configured: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
  };
}

export async function analyzeReportWithGemini({ fileBuffer, mimeType, fileName }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AppError("gemini_not_configured", "Gemini API key is not configured on the server.", 503);
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS || 45000);

  try {
    console.info(`[ReportScan] Sending ${mimeType} report "${fileName}" to Gemini model ${model}`);
    const response = await withTimeout(
      ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              { text: buildPrompt(fileName) },
              {
                inlineData: {
                  mimeType,
                  data: fileBuffer.toString("base64"),
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.1,
          maxOutputTokens: 8192,
        },
      }),
      timeoutMs
    );

    const raw = response.text;
    if (!raw) {
      throw new AppError("empty_gemini_response", "Gemini did not return an analysis. Please try again.", 502);
    }

    return normalizeGeminiResponse(parseGeminiJson(raw));
  } catch (error) {
    if (error instanceof AppError) throw error;

    const message = String(error?.message || "");
    console.error("[ReportScan] Gemini analysis failed", {
      name: error?.name,
      message,
      status: error?.status,
    });

    if (error?.code === "timeout") {
      throw new AppError("gemini_timeout", "Gemini took too long to analyze the report. Please try again.", 504);
    }

    if (/429|quota|rate/i.test(message)) {
      throw new AppError("gemini_rate_limit", "Gemini is currently rate limited. Please try again later.", 429);
    }

    if (/API key|permission|403|401/i.test(message)) {
      throw new AppError("gemini_auth_error", "Gemini authentication failed. Check the server API key.", 503);
    }

    throw new AppError("gemini_api_error", "Gemini could not analyze this report right now.", 502);
  }
}

function withTimeout(promise, timeoutMs) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const error = new Error("Gemini request timed out");
      error.code = "timeout";
      reject(error);
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

function buildPrompt(fileName) {
  return `You are analyzing a medical laboratory report image or PDF named "${fileName}" for a patient-facing education tool.

Return only valid JSON matching the provided schema.

Rules:
- Extract only values, units, reference ranges, comments, and sections that are readable in the uploaded report.
- Do not invent laboratory values, units, reference ranges, patient details, diagnoses, or medications.
- If a value or reference range is unclear, set that field to "unknown" and status to "needs_review".
- Status must be based on the report's own reference range whenever readable.
- If no laboratory results are readable, set status to "unreadable", results to [], confidence to "low", and explain that the report could not be reliably interpreted.
- Use patient-safe wording. Say "may be associated with" instead of "you have".
- Do not prescribe medicines, dosages, or tell the user to start, stop, or change medication.
- Recommendations must be general next steps, such as consult a qualified healthcare professional, retry with a clearer report, follow up, or discuss symptoms.`;
}

function parseGeminiJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new AppError("invalid_gemini_json", "Gemini returned an invalid response. Please try again.", 502);
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      throw new AppError("malformed_gemini_json", "Gemini returned malformed JSON. Please try again.", 502);
    }
  }
}

function normalizeGeminiResponse(data) {
  if (!data || typeof data !== "object" || !Array.isArray(data.results)) {
    throw new AppError("invalid_gemini_response", "Gemini returned an analysis in an unexpected format.", 502);
  }

  const results = data.results.map((result) => ({
    testName: safeString(result.testName, "Unknown test"),
    value: safeString(result.value, "unknown"),
    unit: safeString(result.unit, ""),
    referenceRange: safeString(result.referenceRange, "unknown"),
    status: normalizeStatus(result.status),
    explanation: safeString(result.explanation, "This result needs review by a qualified healthcare professional."),
  }));

  const status = data.status === "success" && results.length > 0 ? "success" : "unreadable";
  return {
    status,
    summary: safeString(data.summary, status === "success" ? "The report was analyzed." : "No readable laboratory values were found."),
    reportSummary: safeString(data.reportSummary, ""),
    confidence: ["high", "medium", "low"].includes(data.confidence) ? data.confidence : "low",
    results,
    abnormalFindings: safeStringArray(data.abnormalFindings),
    normalFindings: safeStringArray(data.normalFindings),
    recommendations: safeStringArray(data.recommendations),
  };
}

function normalizeStatus(status) {
  const value = String(status || "").toLowerCase().replace(/[\s-]+/g, "_");
  return ["high", "normal", "low", "needs_review", "unknown"].includes(value) ? value : "needs_review";
}

function safeString(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function safeStringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim()) : [];
}
