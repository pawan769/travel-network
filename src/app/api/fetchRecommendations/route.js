import dbConnect from "@/lib/dbconnect";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import getItemUserMatrix from "./getItemUserMatrix";
import calculateItemSimilarityMatrix from "./similarityMatrix";
import recommendItemsForUser from "./recommendItemsForUser";

// Haversine function to calculate distance between two points
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in kilometers
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
    console.log("data", userId, latitude, longitude);

    // Validate the presence of user ID and location
    if (!userId || latitude === undefined || longitude === undefined) {
      return NextResponse.json({
        message: "User ID and location (latitude, longitude) are required",
        success: false,
        status: 400,
      });
    }

    // Ensure latitude and longitude are numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json({
        message: "Invalid latitude or longitude",
        success: false,
        status: 400,
      });
    }

    // Connect to the database
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
          return null; // Skip posts without location data
        }

        const distance = haversineDistance(
          lat,
          lon,
          post.location.lat,
          post.location.lng
        );
        return { ...post.toObject(), distance };
      })
      .filter(Boolean); // Remove null values

    if (postsWithDistance.length === 0) {
      return NextResponse.json({
        message: "No nearby posts found",
        success: false,
        posts: [],
      });
    }

    // Sort by distance and select the closest 10 posts
    const sortedDistancePosts = postsWithDistance.sort(
      (a, b) => a.distance - b.distance
    );
    const limitedPosts = sortedDistancePosts;

    console.log("Nearby posts:", limitedPosts);

    // Construct item-user matrix for recommendation
    const itemUserMatrix = {};
    limitedPosts.forEach((post) => {
      itemUserMatrix[post._id] = {};
      post.likes?.forEach((likedUserId) => {
        itemUserMatrix[post._id][likedUserId] = 1;
      });
    });

    console.log("Item-User Matrix:", itemUserMatrix);

    // Calculate item similarity based on likes
    const similarityMatrix = calculateItemSimilarityMatrix(itemUserMatrix);

    // Get recommendations for the user
    const recommendations = recommendItemsForUser(
      userId,
      itemUserMatrix,
      similarityMatrix
    );

    const recommendedPosts = await Post.find({
      _id: { $in: recommendations },
    })
      .populate({ path: "author", select: "name profilePic" })
      .populate({
        path: "comments",
        populate: { path: "commenter", select: "name" },
      });

    // Sort recommended posts in the same order as recommendations
    const sortedPosts = recommendations
      .map((id) => recommendedPosts.find((post) => post._id.toString() === id))
      .filter(Boolean); // Remove null values

    

    const remainingPosts = await Post.find({
      _id: { $nin: recommendations },
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
        posts: finalRecommendation,
        message: "Fetching Recommendation successful",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json({
      error: error.message,
      message: "Fetching Recommendation failed",
      success: false,
      status: 500,
    });
  }
};
