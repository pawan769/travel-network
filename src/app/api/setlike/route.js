import dbConnect from "@/lib/dbconnect";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { userId, postId } = await req.json();
    console.log(userId, postId);

    dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse({
        error: "User not found",
        success: false,
        status: 500,
      });
    }
    const post = await Post.findById(postId);
    

    if (!post) {
      return new NextResponse({
        error: "Post not found",
        success: false,
        status: 500,
      });
    }
    console.log(post.likes.includes(userId));
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      console.log(post);

      await post.save();
      

      return new NextResponse({
        message: "post is liked successfully",
        success: true,
        status: 200,
      });
    } else {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      console.log(post);
      await post.save();
      return new NextResponse({
        message: "Post is unliked successfully",
        success: true,
        status: 200,
      });
    }
  } catch (error) {
    return new NextResponse({
      error: "post couldnot complete like",
      success: false,
      status: 500,
    });
  }
};
