import dbConnect from "@/lib/dbconnect";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import getItemUserMatrix from "./getItemUserMatrix";
import calculateItemSimilarityMatrix from "./similarityMatrix";
import recommendItemsForUser from "./recommendItemsForUser";

export const POST = async (req) => {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({
        message: "User not defined",
        success: false,
        status: 500,
      });
    }

    await dbConnect();

    //creating itemUserMatrix

    const itemUserMatrix = await getItemUserMatrix();
    console.log("itemUserMatrix:", itemUserMatrix);

    //cosine similarity function or finding similarity between two posts based on user interaction

    const similarityMatrix = calculateItemSimilarityMatrix(itemUserMatrix);
    console.log("similarity matrix:", similarityMatrix);

    //get recommendation for user

    const recommendations = recommendItemsForUser(
      userId,
      itemUserMatrix,
      similarityMatrix
    );

    // Fetch all recommended posts in one query
    const recommendedPosts = await Post.find({
      _id: { $in: recommendations },
    })

      .populate({ path: "author", select: "name" }) // Populate author details
      .populate({
        path: "comments", // Populate comments
        populate: { path: "commenter", select: "name" }, // Populate commenter details within comments
      });

    // Log or process the retrieved posts

    return NextResponse.json(
      {
        posts: recommendedPosts,
        message: "Fetching Recommendation successful",
        success: true,
      },
      { status: 200 } // Pass status here
    );
  } catch (error) {
    return NextResponse.json({
      error: error,
      message: "Fetching Recommendation failed",
      success: false,

      status: 400,
    });
  }
};
