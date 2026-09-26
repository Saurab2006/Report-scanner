import { checkMongoConnection, getMongoStatus } from "../../database/mongodb.js";
import { getGeminiStatus } from "../../services/gemini-service.js";

export async function healthHandler(_req, res) {
  const gemini = getGeminiStatus();
  const mongo = getMongoStatus();
  // Health checks must stay responsive even when an Atlas DNS/network request stalls.
  const mongodb = mongo.configured
    ? await Promise.race([
        checkMongoConnection(),
        new Promise((resolve) => setTimeout(() => resolve("unavailable"), 2000)),
      ])
    : "not_configured";
  res.json({
    server: "ok",
    mongodb,
    gemini: gemini.configured ? "configured" : "not_configured",
    model: gemini.configured ? gemini.model : null,
  });
}
