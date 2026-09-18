import { checkMongoConnection, getMongoStatus } from "../../database/mongodb.js";
import { getGeminiStatus } from "../../services/gemini-service.js";

export async function healthHandler(_req, res) {
  const gemini = getGeminiStatus();
  const mongo = getMongoStatus();
  res.json({
    server: "ok",
    mongodb: mongo.configured ? await checkMongoConnection() : "not_configured",
    gemini: gemini.configured ? "configured" : "not_configured",
    model: gemini.configured ? gemini.model : null,
  });
}
