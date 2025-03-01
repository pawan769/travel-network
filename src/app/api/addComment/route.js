import dbConnect from "@/lib/dbconnect";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { postId, comment, commenter } = await req.json();

    await dbConnect();

    if (!comment) {
      return new NextResponse(
        JSON.stringify({
          error: "Please write a comment!",
          success: false,
        }),
        { status: 404 }
      );
    }
    const user = await User.findById(commenter);

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          error: "Commenter not found",
          success: false,
        }),
        { status: 404 }
      );
    }
    const post = await Post.findById(postId);

    if (!post) {
      return new NextResponse(
        JSON.stringify({
          error: " post not found",
          success: false,
        }),
        { status: 404 }
      );
    }

    const newComment = new Comment({ comment, commenter });
    await newComment.save();

    post.comments.push(newComment);

    await post.save();

    await newComment.populate("commenter");

    return new NextResponse(
      JSON.stringify({
        comment: newComment,
        message: "Comment added successfully",
        success: true,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Something went wrong",
        success: false,
      }),
      { status: 400 }
    );
  }
};
