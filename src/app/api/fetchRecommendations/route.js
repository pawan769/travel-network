import dbConnect from "@/lib/dbconnect";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

import calculateItemSimilarityMatrix from "./similarityMatrix";
import recommendItemsForUser from "./recommendItemsForUser";

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const POST = async (req) => {
  try {
    const { id } = await req.json();

    const { userId, latitude, longitude } = id;
   

    if (!userId || latitude === undefined || longitude === undefined) {
      return NextResponse.json({
        message: "User ID and location (latitude, longitude) are required",
        success: false,
        status: 400,
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json({
        message: "Invalid latitude or longitude",
        success: false,
        status: 400,
      });
    }

    await dbConnect();

    // Fetch all posts
    const allPosts = await Post.find({});

    if (allPosts.length === 0) {
      return NextResponse.json({
        message: "No posts found",
        success: false,
        posts: [],
      });
    }

    // Filter posts based on distance
    const postsWithDistance = allPosts
      .map((post) => {
        if (
          !post.location ||
          post.location.lat === undefined ||
          post.location.lng === undefined
        ) {
          return null;
        }

        const distance = haversineDistance(
          lat,
          lon,
          post.location.lat,
          post.location.lng
        );
        return { ...post.toObject(), distance };
      })
      .filter(Boolean); 

    if (postsWithDistance.length === 0) {
      return NextResponse.json({
        message: "No nearby posts found",
        success: false,
        posts: [],
      });
    }

    const sortedDistancePosts = postsWithDistance.sort(
      (a, b) => a.distance - b.distance
    );
    const limitedPosts = sortedDistancePosts;

    const itemUserMatrix = {};
    limitedPosts.forEach((post) => {
      itemUserMatrix[post._id] = {};
      post.likes?.forEach((likedUserId) => {
        itemUserMatrix[post._id][likedUserId] = 1;
      });
    });

    const similarityMatrix = calculateItemSimilarityMatrix(itemUserMatrix);

    const recommendations = recommendItemsForUser(
      userId,
      itemUserMatrix,
      similarityMatrix
    );

    const recommendedPosts = await Post.find({
      _id: { $in: recommendations.sortedRecommendations },
    })
      .populate({ path: "author", select: "name profilePic" })
      .populate({
        path: "comments",
        populate: { path: "commenter", select: "name" },
      });

    
    const sortedPosts = recommendations.sortedRecommendations
      .map((id) => recommendedPosts.find((post) => post._id.toString() === id))
      .filter(Boolean); 

    const remainingPosts = await Post.find({
      _id: { $nin: recommendations.sortedRecommendations },
    })
      .populate({ path: "author", select: "name profilePic" })
      .populate({
        path: "comments",
        populate: { path: "commenter", select: "name" },
      })
      .sort({ createdAt: -1 });

    const finalRecommendation = [...sortedPosts, ...remainingPosts];

    return NextResponse.json(
      {
        similarityMatrix: similarityMatrix,
        itemUserMatrix: itemUserMatrix,
        recommendedScores: recommendations.scores,
        posts: finalRecommendation,
        message: "Fetching Recommendation successful",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
   
    return NextResponse.json({
      error: error.message,
      message: "Fetching Recommendation failed",
      success: false,
      status: 500,
    });
  }
};
