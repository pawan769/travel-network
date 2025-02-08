import dbConnect from "@/lib/dbconnect";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { id } = await req.json();
    await dbConnect();

    const posts = await Post.find()
  .sort({ createdAt: -1 }) 
  .populate({ path: "author", select: "name" }) 
  .populate({
    path: "comments", 
    populate: { path: "commenter", select: "name" }, 
  });

    if (!posts) {
      return new NextResponse(
        JSON.stringify({
          error: " No posts recommendations",
          success: false,
        }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        posts: posts,
        message: "User Found",
        success: true,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "User ID is required",
        success: false,
      }),
      { status: 400 }
    );
  }
};
