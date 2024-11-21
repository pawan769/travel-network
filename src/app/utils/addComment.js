import axios from "axios";

const addComment = async (postId, comment, commenter) => {
  try {
    const response = await axios.post(
      "./api/addComment",
      { postId, comment, commenter },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.comment;
  } catch (error) {
    return response.data;
  }
};
export default addComment;
