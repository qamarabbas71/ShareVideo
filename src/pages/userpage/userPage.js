import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import "./userPage.css";

const UserPage = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null); // For the selected profile picture
  const [preview, setPreview] = useState(null); // For previewing the new profile picture
  const [videos, setVideos] = useState([]); // Fetch videos for the user

  // Fetch user details by ID

  error && console.log(error)
  useEffect(() => {
    const fetchUser = async () => {
      const token = JSON.parse(localStorage.getItem("token")); // Retrieve the token from local storage

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setError("Failed to fetch user details. Please try again.");
      }
    };

    fetchUser();
  }, [id]);

  // Fetch videos for the user
  useEffect(() => {
    const fetchUserVideos = async () => {
      const token = JSON.parse(localStorage.getItem("token")); // Retrieve the token from local storage

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/videos/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVideos(response.data);
      } catch (error) {
        console.error("Failed to fetch user videos:", error);
        setError("Failed to fetch user videos. Please try again.");
      }
    };

    fetchUserVideos();
  }, [id]);

  // Handle profile picture change
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file)); // Set preview for the new profile picture
    }
  };

  // Handle profile picture update
  const handleUpdateProfilePicture = async () => {
    if (!profilePicture) {
      swal("Error", "Please select a profile picture", "error");
      return;
    }
    const token = JSON.parse(localStorage.getItem("token"));
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${id}/profilePicture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      swal("Success", "Profile picture updated successfully", "success");
      setUser(response.data); // Update user data with the new profile picture
    } catch (error) {
      swal("Error", "Failed to update profile picture", "error");
    }
  };

  // Handle video deletion
  const handleDeleteVideo = async (videoId) => {
    const token = JSON.parse(localStorage.getItem("token"));

    swal({
      icon: "warning",
      title: "Delete Video?",
      text: "Are you sure you want to delete this video?",
      buttons: ["Cancel", "Yes"],
    }).then(async (confirm) => {
      if (confirm) {
        try {
          await axios.delete(
            `http://localhost:5000/api/videos/${videoId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Update UI after deletion
          setVideos(videos.filter((video) => video._id !== videoId));
          swal({
            icon: "success",
            title: "Video Deleted!",
            text: "The video has been removed.",
            button: "OK",
          });
        } catch (error) {
          console.error("Failed to delete video:", error);
          swal("Error", "Failed to delete video", "error");
        }
      }
    });
  };

  return (
    <div className="container mt-4">
      {/* Upper Section */}
      <div className="row bg-light p-4 rounded">
        <div className="col-md-4 text-center">
          {/* User Profile */}
          <div className="profile-container">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="rounded-circle mb-2"
                style={{ width: "120px", height: "120px" }}
              />
            ) : (
              <div className="placeholder rounded-circle mb-2">
                <img
                  src={`http://localhost:5000${
                    user?.profilePicture || "./assets/pic1.jpg"
                  }`}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "120px", height: "120px" }}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="form-control mt-2"
            />
            {profilePicture && (
              <button
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={handleUpdateProfilePicture}
              >
                Update Profile Picture
              </button>
            )}
          </div>
        </div>
        <div className="col-md-8 d-flex flex-column justify-content-center">
          {/* User Details */}
          {user ? (
            <>
              <h4 className="text-secondary mb-2">Username: {user.username}</h4>
              <h6 className="text-secondary">Email: {user.email}</h6>
            </>
          ) : (
            <p>Loading user details...</p>
          )}
        </div>
      </div>

      {/* Lower Section */}
      <div className="row mt-4">
        <h5 className="mb-3 text-secondary">Your Videos</h5>
        <div className="video-gallery d-flex flex-wrap justify-content-center">
          {videos.map((video) => (
            <div key={video._id} className="col-md-4 mb-4">
              <div className="card">
                <video
                  src={`http://localhost:5000${video.videoUrl}`}
                  controls
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex justify-content-between">
                  <p className="card-title">{video.title}</p>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteVideo(video._id)}
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
