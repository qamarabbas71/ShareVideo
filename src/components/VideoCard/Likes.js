import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import axios from "axios";
import swal from "sweetalert";
import "./VideoCard.css";

const Likes = ({ videoId, onLikeToggle }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [likeUser, setLikeUser] = useState([]);
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    
    const userData = JSON.parse(localStorage.getItem("user"));
    setUserId(userData?._id || null);
    const fetchLikeCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/likes/${videoId}/likers`
        );
        setLikeUser(response.data.likes);
        setLikeCount(response.data.likes.length);
      } catch (error) {
        // console.error("Error fetching like count:", error);
        // console.log("user not found")
      }
    };

   fetchLikeCount();
  }, [videoId]);

  const userLiked = likeUser.some((like) => like.userId._id === userId);

  const handleLikeToggle = async () => {
    if (!userId) {
      swal({
        icon: "warning",
        title: "You are not logged in!",
        text: "Please log in to like videos.",
        button: "OK",
      });
      return;
    }

    const token = JSON.parse(localStorage.getItem("token"));
    const url = `http://localhost:5000/api/likes/${videoId}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      if (userLiked) {
        // Remove like
        await axios.delete(url, { headers });
        swal({
          icon: "info",
          title: "Like removed!",
          button: "OK",
        });
      } else {
        // Add like
        await axios.post(url, null, { headers });
        swal({
          icon: "success",
          title: "Video liked!",
          button: "OK",
        });
      }

      // Refresh like data after toggle
      const response = await axios.get(
        `http://localhost:5000/api/likes/${videoId}/likers`
      );
      setLikeUser(response.data.likes);
      setLikeCount(response.data.likes.length);

      // Trigger parent handler to update state
      onLikeToggle(response.data.likes);
    } catch (error) {
      console.error("Error toggling like:", error);
      swal({
        icon: "error",
        title: "Error!",
        text: error.message,
        button: "OK",
      });
    }
  };

  return (
    <div className="icon-container">
      {/* Like Icon */}
      <span onClick={handleLikeToggle}>
        {userLiked ? (
          <FaHeart className="icon liked" />
        ) : (
          <FaRegHeart className="icon" />
        )}
      </span>
      {/* Like Count */}
      <span>{likeCount}</span>
    </div>
  );
};

export default Likes;



