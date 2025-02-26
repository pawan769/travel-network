import axios from "axios";

const fetchRecommendations = async (id, latitude, longitude) => {
  try {
    const response = await axios.post(
      "/api/fetchRecommendations",
      { id, latitude, longitude },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.posts;
  } catch (error) {
    console.error(
      "Error fetching recommendations:",
      error.response?.data || error.message
    );
    return (
      error.response?.data || { success: false, message: "Request failed" }
    );
  }
};

export default fetchRecommendations;
