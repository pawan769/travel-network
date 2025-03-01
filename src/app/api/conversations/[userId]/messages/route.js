import Message from "@/models/Message";
import dbConnect from "@/lib/dbconnect";
import mongoose from "mongoose"; // Explicitly import mongoose
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { userId: conversationId } = await params;

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    return NextResponse.json(messages || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { userId: conversationId } = await params;
    console.log("POST conversationId:", conversationId); // Debug
    const { sender, text } = await req.json();
    console.log("Request body:", { sender, text }); // Debug

    // Validate inputs
    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return NextResponse.json(
        { error: "Invalid or missing conversationId" },
        { status: 400 }
      );
    }
    if (!sender || !text) {
      return NextResponse.json(
        { error: "Sender and text are required" },
        { status: 400 }
      );
    }

    // Create a new message
    const newMessage = new Message({
      conversationId,
      sender,
      text,
    });
    await newMessage.save();

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
