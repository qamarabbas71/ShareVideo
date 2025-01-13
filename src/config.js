// const API_BASE_URL = "http://localhost:5000";
const API_BASE_URL = "https://sharevideoapi-e2d6buhyecczese6.uksouth-01.azurewebsites.net";

const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/users/login`,
  register: `${API_BASE_URL}/api/users/register`,
  uploadVideo: `${API_BASE_URL}/api/videos/upload`,
  fetchVideos: `${API_BASE_URL}/api/videos`,
  fetchLikeCount: `${API_BASE_URL}/api/likes/`,
  likeVideoToggle: `${API_BASE_URL}/api/likes/`,
  fetchComments: `${API_BASE_URL}/api/comments/`,
  postComments: `${API_BASE_URL}/api/comments/`,
  deleteComment: `${API_BASE_URL}/api/comments/`,
  fetchUserDetails: `${API_BASE_URL}/api/users`,
  fetchUserVideos: `${API_BASE_URL}/api/videos/user`, 
  updateUserProfilePicture: `${API_BASE_URL}/api/users`, 
  deleteVideo: `${API_BASE_URL}/api/videos`, 
  searchVideo: `${API_BASE_URL}/api/videos/search`, 
  api: `${API_BASE_URL}`,
};

export default API_ENDPOINTS;

