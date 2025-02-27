import axios from "axios";

const getUser = async (id) => {
  if (!id) return 0;
  try {
    const response = await axios.post(
      "/api/getuser",
      { id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response", response);
    return response.data.user;
  } catch (error) {
    return response.data;
  }
};
export default getUser;
