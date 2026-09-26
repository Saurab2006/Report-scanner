import { GoogleGenAI } from "@google/genai";
import { AppError } from "../utils/errors.js";

const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const DEFAULT_FALLBACK_MODEL = "gemini-3.5-flash";
const schema = { type: "object", properties: {
  status: { type: "string", enum: ["success", "unreadable"] }, summary: { type: "string" }, reportSummary: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] },
  results: { type: "array", items: { type: "object", properties: { testName: { type: "string" }, value: { type: "string" }, unit: { type: "string" }, referenceRange: { type: "string" }, status: { type: "string" }, explanation: { type: "string" }, explanationNe: { type: "string" } }, required: ["testName", "value", "unit", "referenceRange", "status", "explanation", "explanationNe"] } },
  abnormalFindings: { type: "array", items: { type: "string" } }, normalFindings: { type: "array", items: { type: "string" } }, recommendations: { type: "array", items: { type: "string" } },
}, required: ["status", "summary", "reportSummary", "confidence", "results", "abnormalFindings", "normalFindings", "recommendations"] };

function models() { return [...new Set([process.env.GEMINI_MODEL || DEFAULT_MODEL, process.env.GEMINI_FALLBACK_MODEL || DEFAULT_FALLBACK_MODEL].filter(Boolean))]; }
export function getGeminiStatus() { return { configured: Boolean(process.env.GEMINI_API_KEY), model: models()[0] }; }

export async function analyzeReportWithGemini({ fileBuffer, mimeType, fileName }) {
  const apiKey = String(process.env.GEMINI_API_KEY || "").trim().replace(/^['"]|['"]$/g, "").replace(/^Bearer\s+/i, "");
  if (!apiKey) throw new AppError("gemini_not_configured", "Gemini API key is not configured on the server.", 503);
  if (!/^(AIza[\w-]{20,}|AQ\.[\w-]{20,})$/.test(apiKey)) {
    throw new AppError("gemini_invalid_key", "The Gemini API key is invalid. Create a new API key in Google AI Studio and set GEMINI_API_KEY in .env.", 503);
  }
  const client = new GoogleGenAI({ apiKey });
  const retries = Math.max(0, Math.min(3, Number(process.env.GEMINI_MAX_RETRIES || 2)));
  const timeoutMs = Math.max(5000, Number(process.env.GEMINI_TIMEOUT_MS || 45000));
  let lastError;
  for (const model of models()) for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      console.info(`[ReportScan] Gemini ${model}, attempt ${attempt + 1}/${retries + 1}`);
      const response = await withTimeout(client.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt(fileName) }, { inlineData: { mimeType, data: fileBuffer.toString("base64") } }] }],
        config: { responseMimeType: "application/json", responseJsonSchema: schema, temperature: 0.1, maxOutputTokens: 4096 },
      }), timeoutMs);
      const raw = response.text;
      if (!raw) throw new AppError("empty_gemini_response", "Gemini did not return an analysis. Please try again.", 502);
      return normalize(parseJson(raw));
    } catch (error) {
      if (error instanceof AppError && !retryable(error)) throw error;
      lastError = error;
      if (!retryable(error) || attempt === retries) break;
      await sleep(Math.min(1000 * 2 ** attempt + Math.floor(Math.random() * 400), 8000));
    }
  }
  const message = String(lastError?.message || "");
  if (/(^|\D)429(\D|$)|quota|rate limit|resource exhausted/i.test(message)) throw new AppError("gemini_rate_limit", "The AI service is busy. We retried automatically; please try again in a minute.", 429, { retryAfterSeconds: 60 });
  if (lastError?.code === "timeout") throw new AppError("gemini_timeout", "Gemini took too long to analyze the report. Please try again.", 504);
  if (/API key|permission|403|401|UNAUTHENTICATED/i.test(message)) throw new AppError("gemini_auth_error", "Gemini authentication failed. Check the server API key.", 503);
  console.error("[ReportScan] Gemini analysis failed", { name: lastError?.name, message });
  throw new AppError("gemini_api_error", "Gemini could not analyze this report right now. Please try again.", 502);
}

function retryable(error) { const message = String(error?.message || ""); const status = Number(error?.status || error?.statusCode || error?.response?.status); return error?.code === "timeout" || [429, 500, 502, 503, 504].includes(status) || /(^|\D)429(\D|$)|quota|rate limit|resource exhausted|temporar/i.test(message); }
function withTimeout(promise, ms) { let id; const timeout = new Promise((_, reject) => { id = setTimeout(() => { const error = new Error("Gemini request timed out"); error.code = "timeout"; reject(error); }, ms); }); return Promise.race([promise, timeout]).finally(() => clearTimeout(id)); }
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function prompt(fileName) { return `Analyze the medical laboratory report named "${fileName}" for a patient-facing educational app. Extract ONLY clearly readable values, units, ranges and comments. Never guess values, diagnoses or medicines. Mark unclear fields unknown and needs_review; determine status only from readable report ranges. For every result, write explanationNe in very simple, parent-friendly Nepali (Devanagari). Do not diagnose or prescribe. If no results are readable, return unreadable with empty results and low confidence. Use non-diagnostic wording and only general follow-up recommendations. Return only JSON matching the schema.`; }
function parseJson(raw) { try { return JSON.parse(raw); } catch { const match = raw.match(/\{[\s\S]*\}/); if (!match) throw new AppError("invalid_gemini_json", "Gemini returned an invalid response. Please try again.", 502); try { return JSON.parse(match[0]); } catch { throw new AppError("malformed_gemini_json", "Gemini returned malformed JSON. Please try again.", 502); } } }
function normalize(data) { if (!data || typeof data !== "object") throw new AppError("invalid_gemini_response", "Gemini returned an analysis in an unexpected format.", 502); const results = Array.isArray(data.results) ? data.results.map((r) => ({ testName: str(r.testName, "Unknown test"), value: str(r.value, "unknown"), unit: str(r.unit, ""), referenceRange: str(r.referenceRange, "unknown"), status: status(r.status), explanation: str(r.explanation, "This result needs review by a qualified healthcare professional."), explanationNe: str(r.explanationNe, "") })) : []; const ok = data.status === "success" && results.length > 0; return { status: ok ? "success" : "unreadable", summary: str(data.summary, ok ? "The report was successfully analyzed." : "No readable laboratory values were found in the uploaded report."), reportSummary: str(data.reportSummary, ok ? "Medical report analysis complete." : "Unable to interpret report content."), confidence: ["high", "medium", "low"].includes(data.confidence) ? data.confidence : "low", results, abnormalFindings: strings(data.abnormalFindings), normalFindings: strings(data.normalFindings), recommendations: strings(data.recommendations) }; }
function str(value, fallback) { return typeof value === "string" && value.trim() ? value.trim() : fallback; }
function strings(value) { return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim()) : []; }
function status(value) { const normalized = String(value || "").toLowerCase().replace(/[\s-]+/g, "_"); return ["high", "normal", "low", "needs_review", "unknown"].includes(normalized) ? normalized : "needs_review"; }
