import axios from "axios";

const getVideos = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/videos");
    return response.data;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};

export default getVideos;
