import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb-helper";


export async function GET(request) {
    const { db } = await connectToDatabase();
    const collection = db.collection("shared_designs");
    const randomDesigns = await collection.aggregate([{ $sample: { size: 10 } }]).toArray();

    return NextResponse.json(randomDesigns, { status: 200 });
}

export async function POST(request) {
    const { db } = await connectToDatabase();
    const collection = db.collection("shared_designs");

    // TODO: validate request.body

    const result = await collection.insertOne(request.body);
    const id = result.insertedId;

    // TODO: get image from Mapbox API and upload to S3
    //const s3 = new S3();
    //await s3.upload(request.body.image, id);

    return NextResponse.json({ desogn_id: id }, { status: 201 });
}
