import axios from "axios";
import API_ENDPOINTS from "../../config";

const getVideos = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.fetchVideos);
    return response.data;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};

export default getVideos;
