import dbConnect from "@/lib/dbconnect";
import { NextResponse } from "next/server";
import User from "@/models/User";
import Post from "@/models/Post";

export async function POST(req) {
  try {
    const newPost = await req.json();
    const { author, caption, image, location, address, description } =
      newPost.post;

    await dbConnect();

    const user = await User.findOne({ _id: author });
    if (!user) {
      throw new Error("Author required");
    }

    if (!image || !image.url || !image.publicId) {
      return NextResponse.json(
        { message: "Image URL and Public ID are required" },
        { status: 400 }
      );
    }
    const post = new Post({
      caption,
      image,
      author,
      location,
      address,
      description,
    });
    await post.save();
    

    return NextResponse.json({ message: "Post Created Successfully", post });
  } catch (error) {
    console.log(error.response.data.message);

    return error.response.data.message;
  }
}
