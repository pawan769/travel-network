import axios from "axios";

const getUser = async (id) => {
  try {
    const response = await axios.post(
      "./api/getuser",
      { id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.user;
  } catch (error) {
    return response.data;
  }
};
export default getUser;
