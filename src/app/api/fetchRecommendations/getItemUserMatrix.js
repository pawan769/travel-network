import dbConnect from "@/lib/dbconnect";
import Post from "@/models/Post";

const getItemUserMatrix = async () => {
  await dbConnect();
  const posts = await Post.find({});
  const itemUserMatrix = {};
  posts.forEach((post) => {
    itemUserMatrix[post._id] = {};
    post.likes?.forEach((userId) => {
      itemUserMatrix[post._id][userId] = 1;
    });
  });

  return itemUserMatrix;
};

export default getItemUserMatrix;
