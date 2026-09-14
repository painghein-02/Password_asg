import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { isAdmin } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/utils";
import { ObjectId } from "mongodb";

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function PUT(request, props) {
  if (!isAdmin(request)) return errorResponse("Unauthorized Request", 403);

  const params = await props.params;
  const data = await request.json();

  if (!data.password) return errorResponse("Missing new password", 400);

  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Safely parse the ID for documents created manually in Atlas
    let queryId;
    try {
      queryId = new ObjectId(params.id);
    } catch {
      queryId = params.id;
    }

    const result = await db
      .collection("user")
      .updateOne(
        { $or: [{ _id: queryId }, { _id: params.id }] },
        { $set: { password: hashedPassword } },
      );

    if (result.matchedCount === 0) return errorResponse("User not found", 404);

    return successResponse({ message: "Password updated" }, 200);
  } catch (error) {
    console.log("PUT Error:", error);
    return errorResponse("Server Error", 500);
  }
}
