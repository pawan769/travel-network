import Conversation from "@/models/Conversation";
import dbConnect from "@/lib/dbconnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, postAuthorId } = await req.json();

    // Check if a conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, postAuthorId] },
    });

    if (existingConversation) {
      return NextResponse.json({ conversation: existingConversation }, { status: 200 });
    }

    // Create a new conversation
    const newConversation = new Conversation({
      participants: [userId, postAuthorId],
    });

    await newConversation.save();
    return NextResponse.json({ conversation: newConversation }, { status: 201 });

  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
