import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb-helper";

export async function GET(request) {
    const { db } = await connectToDatabase();
    const collection = db.collection("shared_designs");
    const randomDesigns = await collection.aggregate([{ $sample: { size: 10 } }]).toArray();

    return NextResponse.json(randomDesigns, { status: 200 });
}