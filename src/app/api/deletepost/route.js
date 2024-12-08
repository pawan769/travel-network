import dbConnect from "@/lib/dbconnect";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { postId, userId } = await req.json();

    dbConnect();

    const post = await Post.findById(postId);
    if (!post) {
      return new NextResponse({
        error: "Post not found",
        success: false,
        status: 400,
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse({
        error: "User not found",
        success: false,
        status: 400,
      });
    }
   
    if (post.author._id.toString() === user._id.toString()) {
      const post = await Post.findByIdAndDelete(postId);
      
      
      return new NextResponse({
        message: "post deleted successfully",
        success: true,
        status: 200,
      });
    }
  } catch (error) {
    console.log("error aayo");
    return new NextResponse({
      error: "Cannot delete post",
      success: false,
      status: 500,
    });
  }
};
