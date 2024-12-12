import axios from "axios";

const setLike = async (userId, postId) => {
  try {
    const response = await axios.post(
      "./api/setlike",
      { userId, postId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
  } catch (error) {
    return response.data;
  }
};
export default setLike;