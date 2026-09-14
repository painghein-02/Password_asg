import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { isAuth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/utils";
import { ObjectId } from "mongodb";

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

export async function PUT(request, props) {
  if (!isAuth(request)) return errorResponse("Unauthorized", 401);

  const params = await props.params;
  const userId = request.headers.get("x-user-id") || "unknown";
  const data = await request.json();

  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);

    const updateData = { ...data };
    delete updateData._id;

    let queryId;
    try {
      queryId = new ObjectId(params.id);
    } catch {
      queryId = params.id;
    }

    const result = await db
      .collection("item")
      .updateOne(
        { $or: [{ _id: queryId }, { _id: params.id }] },
        { $set: updateData },
      );

    if (result.matchedCount === 0) return errorResponse("Item not found", 404);

    await logAudit(
      db,
      "UPDATE_ITEM",
      { itemId: params.id, changes: updateData },
      userId,
    );

    return successResponse({ message: "Item updated successfully" }, 200);
  } catch (error) {
    return errorResponse("Failed to update item", 500);
  }
}

export async function DELETE(request, props) {
  if (!isAuth(request)) return errorResponse("Unauthorized", 401);

  const params = await props.params;
  const userId = request.headers.get("x-user-id") || "unknown";

  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME);

    let queryId;
    try {
      queryId = new ObjectId(params.id);
    } catch {
      queryId = params.id;
    }

    const result = await db.collection("item").deleteOne({
      $or: [{ _id: queryId }, { _id: params.id }],
    });

    if (result.deletedCount === 0) return errorResponse("Item not found", 404);

    await logAudit(db, "DELETE_ITEM", { itemId: params.id }, userId);

    return successResponse({ message: "Item deleted successfully" }, 200);
  } catch (error) {
    return errorResponse("Failed to delete item", 500);
  }
}
