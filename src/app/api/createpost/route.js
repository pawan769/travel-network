import dbConnect from "@/lib/dbconnect";
import { NextResponse } from "next/server";
import User from "@/models/User";
import Post from "@/models/Post";

export async function POST(req) {
  try {
    const { author, caption } = await req.json();
    await dbConnect();

    const user = await User.findOne({ _id: author });
    if (!user) {
      throw new Error("Author required");
    }

    const post = new Post({ author, caption });
    await post.save();

    console.log("Post created successfully");
    return new NextResponse(
      JSON.stringify({ message: "Post Created Successfully" })
    );
  } catch (error) {
    throw new Error(error);
  }
}
