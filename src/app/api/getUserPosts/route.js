import dbConnect from "@/lib/dbconnect";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { id } = await req.json();

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "User ID is required", success: false }),
        { status: 400 }
      );
    }

    await dbConnect();

    const posts = await Post.find({ author: id })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "name" })
      .populate({
        path: "comments",
        populate: { path: "commenter", select: "name" },
      });

    if (posts.length === 0) {
      return new NextResponse(
        JSON.stringify({posts: [], message: "No posts found", success: false }),
        { status: 200 }
      );
    }

    return new NextResponse(
      JSON.stringify({ posts, message: "Posts found", success: true }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error", success: false }),
      { status: 500 }
    );
  }
};
