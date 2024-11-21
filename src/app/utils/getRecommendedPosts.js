import axios from "axios";

const getRecommendedPosts = async (id) => {
  try {
    const response = await axios.post(
      "./api/getRecommendedPosts",
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
export default getRecommendedPosts;
