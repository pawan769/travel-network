import dbConnect from "@/lib/dbconnect";
import Conversation from "@/models/Conversation";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, postAuthorId } = await req.json();

    // Validate input
    if (!userId || !postAuthorId) {
      return NextResponse.json(
        { error: "userId and postAuthorId are required" },
        { status: 400 }
      );
    }

    // Check if a conversation already exists between these two users
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, postAuthorId], $size: 2 }, // Exact match for two participants
    })
      .populate("participants", "name _id") // Optional: populate for richer response
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 }, // Optional: latest message
      })
      .lean(); // Convert to plain JS object

    if (existingConversation) {
      // If conversation exists, return it with 200 OK
      return NextResponse.json(existingConversation, { status: 200 });
    }

    // If no conversation exists, create a new one
    const newConversation = new Conversation({
      participants: [userId, postAuthorId],
      messages: [],
    });
    await newConversation.save();

    return NextResponse.json(newConversation, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
