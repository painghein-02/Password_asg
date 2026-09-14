import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { isAuth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/utils";

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

async function logAudit(db, action, details, userId) {
  await db.collection("audit_log").insertOne({
    action,
    details,
    userId,
    timestamp: new Date(),
  });
}

export async function GET(request) {
  if (!isAuth(request)) return errorResponse("Unauthorized", 401);
  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);
    const items = await db.collection("item").find({}).toArray();
    return successResponse(items, 200);
  } catch (error) {
    return errorResponse("Failed to fetch items", 500);
  }
}

export async function POST(request) {
  if (!isAuth(request)) return errorResponse("Unauthorized", 401);

  const userId = request.headers.get("x-user-id") || "unknown";
  const data = await request.json();

  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);
    const result = await db.collection("item").insertOne(data);

    await logAudit(
      db,
      "CREATE_ITEM",
      { itemId: result.insertedId, data },
      userId,
    );

    return successResponse({ id: result.insertedId }, 201);
  } catch (error) {
    return errorResponse("Failed to create item", 500);
  }
}
