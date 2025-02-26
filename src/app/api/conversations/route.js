import Conversation from "@/models/Conversation";
import dbConnect from "@/lib/dbconnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all conversations and populate the messages field
    const conversations = await Conversation.find({})
      .populate("participants")
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 }, // Get the latest message
      });

    return NextResponse.json(conversations, { status: 200 });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
