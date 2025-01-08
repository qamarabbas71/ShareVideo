import React, { useRef, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FaRegHeart, FaHeart, FaCommentDots, FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./VideoCard.css";
import axios from "axios";

const videos = [
  {
    videoId: 1,
    videoSrc: "/assets/video1.mp4",
    profilePicture: "/assets/pic1.jpg",
    username: "JohnDoe",
    likes: [
      { userId: 1, username: "Alice", profilePicture: "/assets/pic1.jpg" },
      { userId: 2, username: "Bob", profilePicture: "/assets/pic2.jpg" },
    ],
    comments: [{ userId: 3, username: "Charlie", text: "Great video!" }],
  },
  {
    videoId: 2,
    videoSrc: "/assets/video2.mp4",
    profilePicture: "/assets/pic2.jpg",
    username: "JaneDoe",
    likes: [],
    comments: [],
  },
  {
    videoId: 3,
    videoSrc: "/assets/video3.mp4",
    profilePicture: "/assets/pic1.jpg",
    username: "Alex",
    likes: [{ userId: 4, username: "Daisy", profilePicture: "/assets/pic2.jpg" }],
    comments: [{ userId: 5, username: "Eve", text: "Awesome video!" }],
  },
];

const VideoCard = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const videoRef = useRef(null);
  const currentVideo = videos[currentVideoIndex];
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentVideoIndex]);

  const handleVideoClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleLikeClick = () => {
    const userLiked = currentVideo.likes.some((like) => like.userId === 1);
    if (userLiked) {
      currentVideo.likes = currentVideo.likes.filter((like) => like.userId !== 1);
    } else {
      currentVideo.likes.push({
        userId: 1,
        username: "CurrentUser",
        profilePicture: "/assets/pic1.jpg",
      });
    }
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      currentVideo.comments.push({
        userId: 1,
        username: "CurrentUser",
        text: newComment,
      });
      setNewComment("");
    }
  };

  return (
    <div className="video-card">
      {/* Top Section */}
      <div className="top-section">
        <img
          src={currentVideo.profilePicture}
          alt="Profile"
          className="profile-picture"
        />
        <span className="username">{currentVideo.username}</span>
        <FaArrowUp
          className={`navigation-icon ${currentVideoIndex === 0 ? "disabled" : ""}`}
          onClick={() => setCurrentVideoIndex(currentVideoIndex - 1)}
          title="Previous Video"
        />
      </div>

      {/* Video Player */}
      <div className="video-player-container" onClick={handleVideoClick}>
        <video
          ref={videoRef}
          src={currentVideo.videoSrc}
          loop
          muted
          autoPlay
          className="video-player"
        />
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="icon-container" onClick={handleLikeClick}>
          {currentVideo.likes.some((like) => like.userId === 1) ? (
            <FaHeart className="icon liked" />
          ) : (
            <FaRegHeart className="icon" />
          )}
          <span onClick={() => setShowLikeModal(true)}>
            {currentVideo.likes.length}
          </span>
        </div>
        <div className="icon-container" onClick={() => setShowComments(true)}>
          <FaCommentDots className="icon" />
          <span>{currentVideo.comments.length}</span>
        </div>
        <FaArrowDown
          className={`navigation-icon ${currentVideoIndex === videos.length - 1 ? "disabled" : ""}`}
          onClick={() => setCurrentVideoIndex(currentVideoIndex + 1)}
          title="Next Video"
        />
      </div>

      {/* Likes Modal */}
      <Modal show={showLikeModal} onHide={() => setShowLikeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Likes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentVideo.likes.length > 0 ? (
            currentVideo.likes.map((like, index) => (
              <div key={index} className="like-item d-flex align-items-center">
                <img
                  src={like.profilePicture}
                  alt="Profile"
                  className="like-profile-pic me-2"
                />
                <span>{like.username}</span>
              </div>
            ))
          ) : (
            <p>No likes yet.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Comments Modal */}
      <Modal show={showComments} onHide={() => setShowComments(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentVideo.comments.length > 0 ? (
            currentVideo.comments.map((comment, index) => (
              <div key={index} className="comment-item">
                <span className="comment-username">{comment.username}:</span>
                <p>{comment.text}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
          <div className="input-group mt-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="form-control"
            />
            <button
              onClick={handleCommentSubmit}
              className="btn btn-primary"
            >
              Post
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VideoCard;
