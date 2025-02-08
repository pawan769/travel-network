import axios from "axios";

const fetchRecommendations = async (id) => {
  try {
    const response = await axios.post(
      "./api/fetchRecommendations",
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
export default fetchRecommendations;
