import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/utils";

export async function GET(request) {
  if (!isAdmin(request)) return errorResponse("Unauthorized Request", 403);

  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);
    // Projection ensures passwords are not sent to the frontend
    const users = await db
      .collection("user")
      .find({}, { projection: { password: 0 } })
      .toArray();
    return successResponse({ users }, 200);
  } catch (error) {
    return errorResponse("Failed to fetch users", 500);
  }
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
