import axios from "axios";

const deletePost = async (postId, userId) => {
  try {
    const response = await axios.post(
      "./api/deletepost",
      { postId, userId },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return error;
  }
};

export default deletePost;
