
import dbConnect from "@/lib/dbconnect";
import Post from "@/models/Post";

export async function GET(req) {
  try {
    
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search"); 


    if (!search) return Response.json({ posts: [] });

    await dbConnect();

    // Perform a case-insensitive search
    const posts = await Post.find({
      $or: [
        { caption: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ],
    }).limit(5);


    return Response.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
