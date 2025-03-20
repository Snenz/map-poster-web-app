import { MongoClient } from "mongodb";

const URI = process.env.MONGODB_ATLAS_URI;
const DB_NAME = process.env.MONDODB_ATLAS_DB_NAME;

let client;
let db;

export async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(URI);
        await client.connect();
        db = client.db(DB_NAME);
    }

    return { client, db };
}