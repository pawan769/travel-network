import { NextResponse } from "next/server";
import Post from "@/models/Post";

// Function to calculate the Haversine distance
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
  const distance = R * c; // Distance in kilometers
  return distance;
};

export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const lat = parseFloat(searchParams.get("lat"));
  const lon = parseFloat(searchParams.get("lon"));

  // Check if latitude and longitude are provided
  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and Longitude are required" },
      { status: 400 }
    );
  }

  try {
    const posts = await Post.find();

    const postsWithDistance = posts.map((post) => {
      const distance = haversineDistance(
        lat,
        lon,
        post.location.lat,
        post.location.lng
      );
      return { ...post.toObject(), distance };
    });

    const sortedPosts = postsWithDistance.sort(
      (a, b) => a.distance - b.distance
    );

    const limitedPosts = sortedPosts.slice(0, 10); // Optional: limit to 50 posts

    return NextResponse.json(limitedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
