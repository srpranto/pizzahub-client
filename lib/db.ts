import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pizzahub";

const globalWithMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
};

export const client: MongoClient =
  globalWithMongo._mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalWithMongo._mongoClient = client;
}

export const db: Db = client.db(process.env.MONGODB_DB_NAME || "pizzahub");
