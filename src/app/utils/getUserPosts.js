import axios from "axios";

const getUserPosts = async (id) => {
  try {
    const response = await axios.post(
      "../api/getUserPosts",
      { id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.posts;
  } catch (error) {
    return response.data;
  }
};
export default getUserPosts;
