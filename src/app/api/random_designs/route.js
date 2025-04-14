import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb-helper";

/* Fetch a specific number of random designs. Returns an array of design uuids and image preview urls.
 * The number of designs to fetch can be specified in the query string as "count".
 */
export async function GET(request) {
    try {
        const url = new URL(request.url);
        const count = parseInt(url.searchParams.get("count")) || 8; // default to 8 if not provided

        const { db } = await connectToDatabase();
        const collection = db.collection("shared_designs");

        const designs = await collection.aggregate([{ $sample: { size: count } }]).toArray();
        if (!designs || designs.length < count) {
            return NextResponse.json({ error: "Not enough designs found." }, { status: 404 });
        }

        const random_designs = designs.map(design => ({ design_id: design.uuid, preview_img_url: design.preview_img_url }));
        return NextResponse.json(random_designs, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch design." }, { status: 500 });
    }
}