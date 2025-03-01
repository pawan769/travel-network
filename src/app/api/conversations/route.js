import dbConnect from "@/lib/dbconnect";
import ConversationSchema from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all conversations and populate participants and latest message
    const conversations = await ConversationSchema.find({})
      .populate("participants", "name _id") // Only fetch necessary fields
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 }, // Latest message
      })
      .lean(); // Convert to plain JS objects for better performance

    // Ensure we always return an array, even if empty
    return NextResponse.json(conversations || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    // Return an empty array with an error status to keep frontend consistent
    return NextResponse.json([], {
      status: 500,
      headers: { "X-Error": "Failed to fetch conversations" },
    });
  }
}
