import { MongoClient } from "mongodb";
import { AppError } from "@/lib/errors";

const globalForMongo = globalThis;

function getMongoConfig() {
  return {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME || "reportscan",
  };
}

export function getMongoStatus() {
  const { uri } = getMongoConfig();
  return {
    configured: Boolean(uri),
  };
}

export async function getMongoDb() {
  const { uri, dbName } = getMongoConfig();

  if (!uri) {
    throw new AppError("mongodb_not_configured", "MongoDB is not configured on the server.", 503);
  }

  if (!globalForMongo._reportscanMongoPromise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      maxPoolSize: 10,
    });

    globalForMongo._reportscanMongoPromise = client.connect().catch((error) => {
      globalForMongo._reportscanMongoPromise = null;
      console.error("[ReportScan] MongoDB connection failed", {
        name: error?.name,
        message: error?.message,
      });
      throw new AppError("mongodb_connection_failed", "MongoDB is unavailable. Please check the database connection.", 503);
    });
  }

  const client = await globalForMongo._reportscanMongoPromise;
  return client.db(dbName);
}

export async function checkMongoConnection() {
  try {
    const db = await getMongoDb();
    await db.command({ ping: 1 });
    return "connected";
  } catch {
    return "unavailable";
  }
}
