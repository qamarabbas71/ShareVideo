import React, { useRef, useState, useEffect, useContext } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Likes from "./Likes";
import Comments from "./Comments";
import { UserContext } from "../../context/userContext.js";
import "./VideoCard.css";
import getVideos from "./api";
// import API_ENDPOINTS from "../../config.js";

const VideoCard = () => {
  const { user } = useContext(UserContext);
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [error, setError] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false); // Track user interaction

  const videoRef = useRef(null);

  // Fetch videos from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoData = await getVideos();
        const sanitizedVideos = videoData.map((video) => ({
          ...video,
          videoUrl: video.videoUrl
            ? `${video.videoUrl}`
            : null,
          likes: Array.isArray(video.likes) ? video.likes : [],
          comments: Array.isArray(video.comments) ? video.comments : [],
        }));
        setVideos(sanitizedVideos);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };

    fetchVideos();
  }, []);

  const currentVideo = videos[currentVideoIndex] || {};
  // console.log(currentVideo.uploadedBy?.profilePicture)

  // Playback control
  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    const managePlayback = async () => {
      try {
        if (isPlaying && currentVideo.videoUrl) {
          videoElement.muted = !userInteracted; // Muted until user interaction
          await videoElement.play();
          setError(false); // Reset error state
        } else {
          videoElement.pause();
        }
      } catch (err) {
        setError(true);
        console.error("Error playing video:", err.message);
      }
    };

    managePlayback();

    return () => {
      if (videoElement) videoElement.pause();
    };
  }, [isPlaying, currentVideoIndex, currentVideo.videoUrl, userInteracted]);

  const handleVideoClick = () => {
    setIsPlaying((prevState) => !prevState);
    setUserInteracted(true); // Mark user interaction
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    setIsPlaying(true);
  };

  const handlePreviousVideo = () => {
    setCurrentVideoIndex(
      (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
    );
    setIsPlaying(true);
  };

  const handleVideoError = () => {
    console.error("Video failed to load:", currentVideo.videoUrl);
    setError(true);
  };

  return (
    <div className="video-card" onClick={() => setUserInteracted(true)}>
      {/* Top Section */}
      <div className="top-section">
        <img
         src={`${currentVideo.uploadedBy?.profilePicture || './assets/pic1.jpg'}`}
          alt="Profile"
          className="profile-picture"
        />
        <span className="username">
          {currentVideo.uploadedBy?.username || "Anonymous"}
        </span>
        <FaArrowUp
          className="navigation-icon"
          onClick={handlePreviousVideo}
          title="Previous Video"
        />
      </div>

      {/* Video Player */}
      <div className="video-player-container" onClick={handleVideoClick}>
        {currentVideo.videoUrl && !error ? (
          <video
            ref={videoRef}
            src={currentVideo.videoUrl}
            loop
            autoPlay
            className="video-player"
            onError={handleVideoError}
          />
        ) : (
          <p className="error-message">Video not available</p>
        )}
      </div>

      {/* Title and Description */}
      <div className="video-details mt-1">
        <h6 style={{ fontWeight: "bold" }}>
          {currentVideo.title || "No Title"}
        </h6>
        <p
          className="mb-2"
          style={{ color: "#555", fontSize: "12px", marginTop: "-4px" }}
        >
          {currentVideo.description || "No Description"}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        {currentVideo._id && user ? (
          <Likes
            videoId={currentVideo._id}
            likes={currentVideo.likes || []}
            userId={user._id}
            onLikeToggle={(updatedLikes) => {
              setVideos((prev) =>
                prev.map((video, index) =>
                  index === currentVideoIndex
                    ? { ...video, likes: updatedLikes }
                    : video
                )
              );
            }}
          />
        ) : (
          <Likes videoId={currentVideo._id} />
        )}

        {/* Conditional rendering for Comments */}
        {currentVideo._id && (
          <Comments
            videoId={currentVideo._id}
            comments={currentVideo.comments}
            onCommentSubmit={(text) => {
              const newComment = {
                userId: user.id,
                username: user.username,
                text,
              };
              setVideos((prev) =>
                prev.map((video, index) =>
                  index === currentVideoIndex
                    ? {
                        ...video,
                        comments: [...currentVideo.comments, newComment],
                      }
                    : video
                )
              );
            }}
          />
        )}

        <FaArrowDown
          className="navigation-icon"
          onClick={handleNextVideo}
          title="Next Video"
        />
      </div>
    </div>
  );
};

export default VideoCard;
