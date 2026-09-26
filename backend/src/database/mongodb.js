import { MongoClient } from "mongodb";
import { AppError } from "../utils/errors.js";

const globalForMongo = globalThis;

function getMongoConfig() {
  // Trim accidental spaces/quotes around a copied Atlas URI without altering valid URI characters.
  const configuredUri = (process.env.MONGODB_URI || process.env.MONGO_URI || "").trim().replace(/^['"]|['"]$/g, "");
  const uri = withDirectAtlasHosts(configuredUri, process.env.MONGO_DIRECT_HOSTS);
  return { uri, dbName: (process.env.MONGODB_DB_NAME || process.env.MONGO_DB_NAME || "reportscan").trim() };
}

// Some Windows networks reject SRV DNS lookups used by mongodb+srv URIs. The
// Atlas hosts supplied here are resolved by the normal DNS resolver instead.
function withDirectAtlasHosts(uri, directHosts) {
  if (!directHosts?.trim() || !uri.startsWith("mongodb+srv://")) return uri;
  const [base, existingQuery = ""] = uri.split("?", 2);
  const atIndex = base.lastIndexOf("@");
  if (atIndex < 0) return uri;
  const query = new URLSearchParams(existingQuery);
  query.set("tls", "true");
  query.set("authSource", "admin");
  query.set("replicaSet", process.env.MONGO_REPLICA_SET || "atlas-tzbgi5-shard-0");
  return `mongodb://${base.slice("mongodb+srv://".length, atIndex + 1)}${directHosts.trim()}?${query}`;
}

export function getMongoStatus() { return { configured: Boolean(getMongoConfig().uri) }; }

export async function getMongoDb() {
  const { uri, dbName } = getMongoConfig();
  if (!uri) throw new AppError("mongodb_not_configured", "MongoDB is not configured on the server.", 503);
  if (!globalForMongo._reportscanMongoPromise) {
    const client = new MongoClient(uri, {
      // Do not make the report scan wait a long time when Atlas/local MongoDB is offline.
      serverSelectionTimeoutMS: 4000, connectTimeoutMS: 4000, maxPoolSize: 10,
      retryReads: true, retryWrites: true,
    });
    globalForMongo._reportscanMongoPromise = client.connect().catch((error) => {
      globalForMongo._reportscanMongoPromise = null;
      console.error("[ReportScan] MongoDB connection failed", { name: error?.name, message: error?.message });
      throw new AppError("mongodb_connection_failed", "MongoDB is unavailable. Check the connection string, Atlas network access, and database user.", 503);
    });
  }
  return (await globalForMongo._reportscanMongoPromise).db(dbName);
}

export async function checkMongoConnection() {
  try { const db = await getMongoDb(); await db.command({ ping: 1 }); return "connected"; }
  catch { return "unavailable"; }
}
