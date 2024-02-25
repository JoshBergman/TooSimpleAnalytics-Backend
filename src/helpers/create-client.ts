import { MongoClient } from "mongodb";

export const createClient = () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("No DB-URI Found");
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: "1",
      deprecationErrors: true,
    },
  });

  const db = client.db("tsa");
  const users = db.collection("users");

  return { client, db, users };
};
