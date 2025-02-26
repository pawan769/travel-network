import Message from "@/models/Message";
import dbConnect from "@/lib/dbconnect";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { conversationId } = params;

    // Fetch messages for the specified conversation
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

    const { conversationId } = params;
    const { sender, text } = await req.json();

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
