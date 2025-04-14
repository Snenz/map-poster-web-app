import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";

import { connectToDatabase } from "@/lib/mongodb-helper";
import { designSchemaGET, designSchemaPOST } from "@/lib/api_schemes";

/* Fetch a design by id. Returns the design data. */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const design_id = searchParams.get("design_id");
        if (!design_id || design_id.length !== 36) {
            return NextResponse.json({ error: "Invalid design id." }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        const collection = db.collection("shared_designs");

        const design = await collection.findOne({ uuid: design_id });
        if (!design) {
            return NextResponse.json({ error: "Design not found." }, { status: 404 });
        }

        return NextResponse.json(design, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch design." }, { status: 500 });
    }
}

/* Publish a design to share it with other users. Stores the design's data in database and returns id. */
export async function POST(request) {
    try {
        const body = await request.json();

        const parse = designSchemaPOST.safeParse(body);
        if (!parse.success) {
            return NextResponse.json({ error: parse.error.message }, { status: 400 });
        }

        const design_data = parse.data;

        const { db } = await connectToDatabase();
        const collection = db.collection("shared_designs");

        // FIX: This is a temporary fix to add a preview image URL to the design data.
        const preview_img_url = "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg";

        const design_id = uuidv4();
        const res = await collection.insertOne({ uuid: design_id, preview_img_url: preview_img_url, ...design_data });
        if (!res.acknowledged) {
            return NextResponse.json({ error: "Failed to publish design." }, { status: 500 });
        }

        return NextResponse.json({ design_id: design_id }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to publish design." }, { status: 500 });
    }
}
