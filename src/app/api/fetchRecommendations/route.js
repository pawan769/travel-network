import dbConnect from "@/lib/dbconnect";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import getItemUserMatrix from "./getItemUserMatrix";
import calculateItemSimilarityMatrix from "./similarityMatrix";
import recommendItemsForUser from "./recommendItemsForUser";

export const POST = async (req) => {
  try {
    const { id: userId } = await req.json();
    console.log(userId);

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

    //cosine similarity function

    const similarityMatrix = calculateItemSimilarityMatrix(itemUserMatrix);

    //get recommendation for user

    const recommendations = recommendItemsForUser(
      userId,
      itemUserMatrix,
      similarityMatrix
    );

    // Fetch all recommended posts
    const recommendedPosts = await Post.find({
      _id: { $in: recommendations },
    })

      .populate({ path: "author", select: "name profilePic" })
      .populate({
        path: "comments",
        populate: { path: "commenter", select: "name" },
      });

    const sortedPosts = recommendations.map((id) =>
      recommendedPosts.find((post) => post._id.toString() === id)
    );
    

    //fetch remaining posts

    const remainingPosts = await Post.find({
      _id: { $nin: recommendations },
    })
      .populate({ path: "author", select: "name profilePic" })
      .populate({
        path: "comments",
        populate: { path: "commenter", select: "name" },
      })
      .sort({ createdAt: -1 });

    //first recommended posts and then remaining posts

    const finalRecommendation = [...sortedPosts, ...remainingPosts];

    return NextResponse.json(
      {
        posts: finalRecommendation,
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
