import dbConnect from "@/lib/dbconnect"; // Assuming this is your DB connection utility
import Conversation from "@/models/Conversation";

import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { userId } = await params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name _id")
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 },
      })
      .lean();

    if (!conversations || conversations.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(conversations, { status: 200 });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
