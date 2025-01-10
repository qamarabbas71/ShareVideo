// src/apiConfig.js

const API_BASE_URL = "http://localhost:5000";

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
  api: `${API_BASE_URL}`,

};

export default API_ENDPOINTS;
