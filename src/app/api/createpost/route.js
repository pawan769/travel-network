import dbConnect from "@/lib/dbconnect";
import { NextResponse } from "next/server";
import User from "@/models/User";
import Post from "@/models/Post";

export async function POST(req) {
  try {
    const newPost = await req.json();
    console.log("Incoming Post Data:", newPost); // Debugging

    const postData = newPost.post || {}; // Prevents destructuring errors
    const { author, caption, images, location, address, description } =
      postData;
      console.log(images);

    // Check if images is an array and has at least one image
    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { message: "At least one image with URL and Public ID is required" },
        { status: 400 }
      );
    }

    // Validate each image
    for (const image of images) {
      if (!image.url || !image.publicId) {
        return NextResponse.json(
          { message: "Each image must have a URL and Public ID" },
          { status: 400 }
        );
      }
    }

    await dbConnect();

    const user = await User.findOne({ _id: author });
    if (!user) {
      return NextResponse.json({ message: "Author required" }, { status: 400 });
    }

    const post = new Post({
      caption,
      images, // Store images as an array
      author,
      location,
      address,
      description,
    });

    await post.save();

    return NextResponse.json({ message: "Post Created Successfully", post });
  } catch (error) {
    console.error("Error creating post:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
