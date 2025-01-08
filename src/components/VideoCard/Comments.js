// import React, { useState, useEffect } from "react";
// import { Modal } from "react-bootstrap";
// import { FaCommentDots, FaPaperPlane, FaTrash } from "react-icons/fa";
// import axios from "axios";
// import swal from "sweetalert";
// import "./VideoCard.css";

// const Comments = ({ videoId, comments = [], onCommentSubmit }) => {
//   const [showComments, setShowComments] = useState(false);
//   const [newComment, setNewComment] = useState("");
//   const [allComments, setAllComments] = useState(comments);

//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/comments/${videoId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
//             },
//           }
//         );
//         setAllComments(response.data);
//       } catch (error) {
//         console.error("Error fetching comments:", error);
//       }
//     };

//     fetchComments();
//   }, [videoId]);

//   // Handle comment submission
//   const handleCommentSubmit = async () => {
//     if (newComment.trim()) {
//       try {
//         const token = JSON.parse(localStorage.getItem("token"));
//         const response = await axios.post(
//           `http://localhost:5000/api/comments/${videoId}`,
//           { text: newComment },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         // Add the new comment with the full user object to the comments list
//         setAllComments([...allComments, response.data.comment]);
//         onCommentSubmit([...allComments, response.data.comment]); // Update parent if needed
//         setNewComment("");

//         swal({
//           icon: "success",
//           title: "Comment added successfully!",
//           timer: 1500,
//           button: "OK",
//         });
//       } catch (error) {
//         console.error("Error posting comment:", error);
//         swal({
//           icon: "warning",
//           title: "OOPPS....!",
//           text: "You are not logged In.",
//           timer: 3500,
//           button: "OK",
//         });
//       }
//     }
//   };

//   // Handle comment deletion
//   const handleDeleteComment = (commentId) => {
//     swal({
//       icon: "info",
//       title: "Comment deleted!",
//       text: "The comment will be removed.",
//       timer: 1500,
//       button: "OK",
//     });

//     // TODO: Add functionality to delete the comment from the server
//   };

//   return (
//     <div>
//       {/* Comment Icon */}
//       <div className="icon-container" onClick={() => setShowComments(true)}>
//         <FaCommentDots className="icon" />
//         <span>{allComments.length}</span> {/* Display the length of all comments */}
//       </div>

//       {/* Comments Modal */}
//       <Modal show={showComments} onHide={() => setShowComments(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Comments</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {/* Render Comments */}
//           {allComments.length > 0 ? (
//             allComments.map((comment) => (
//               <div key={comment._id} className="comment-item d-flex justify-content-between align-items-center">
//                 <div>
//                   <span className="comment-username">
//                     {comment.userId.username || "Unknown"}:
//                   </span>
//                   <p>{comment.text}</p>
//                 </div>
//                 <FaTrash
//                   className="delete-icon text-danger"
//                   onClick={() => handleDeleteComment(comment._id)} // Call delete handler
//                 />
//               </div>
//             ))
//           ) : (
//             <p>No comments yet.</p>
//           )}

//           {/* New Comment Input and Send Icon */}
//           <div className="input-group mt-3">
//             <input
//               type="text"
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               placeholder="Write a comment..."
//               className="form-control"
//             />
//             <button onClick={handleCommentSubmit} className="btn btn-primary">
//               <FaPaperPlane /> {/* Send Icon */}
//             </button>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default Comments;


import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FaCommentDots, FaPaperPlane, FaTrash } from "react-icons/fa";
import axios from "axios";
import swal from "sweetalert";
import "./VideoCard.css";

const Comments = ({ videoId, comments = [], onCommentSubmit }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState(comments);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/comments/${videoId}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
            },
          }
        );
        setAllComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [videoId]);

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const response = await axios.post(
          `http://localhost:5000/api/comments/${videoId}`,
          { text: newComment },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Add the new comment with the full user object to the comments list
        setAllComments([...allComments, response.data.comment]);
        onCommentSubmit([...allComments, response.data.comment]); // Update parent if needed
        setNewComment("");

        swal({
          icon: "success",
          title: "Comment added successfully!",
          timer: 1500,
          button: "OK",
        });
      } catch (error) {
        console.error("Error posting comment:", error);
        swal({
          icon: "warning",
          title: "OOPPS....!",
          text: "You are not logged In.",
          timer: 3500,
          button: "OK",
        });
      }
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      await swal({
        title: "Are you sure?",
        text: "You want to delete this comment?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Filter out the deleted comment
          const updatedComments = allComments.filter(
            (comment) => comment._id !== commentId
          );
          setAllComments(updatedComments);
          onCommentSubmit(updatedComments); // Update parent if needed

          swal({
            icon: "success",
            title: "Comment deleted successfully!",
            timer: 1500,
            button: "OK",
          });
        }
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      swal({
        icon: "error",
        title: "Failed to delete comment!",
        text: error.response?.data?.message || "Something went wrong.",
        button: "OK",
      });
    }
  };

  return (
    <div>
      {/* Comment Icon */}
      <div className="icon-container" onClick={() => setShowComments(true)}>
        <FaCommentDots className="icon" />
        <span>{allComments.length}</span> {/* Display the length of all comments */}
      </div>

      {/* Comments Modal */}
      <Modal show={showComments} onHide={() => setShowComments(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Render Comments */}
          {allComments.length > 0 ? (
            allComments.map((comment) => (
              <div
                key={comment._id}
                className="comment-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <span className="comment-username">
                    {comment.userId.username || "Unknown"}:
                  </span>
                  <p>{comment.text}</p>
                </div>
                {comment.userId._id === JSON.parse(localStorage.getItem("user"))?._id && (
                  <FaTrash
                    className="delete-icon text-danger"
                    onClick={() => handleDeleteComment(comment._id)} // Call delete handler
                  />
                )}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}

          {/* New Comment Input and Send Icon */}
          <div className="input-group mt-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="form-control"
            />
            <button onClick={handleCommentSubmit} className="btn btn-primary">
              <FaPaperPlane /> {/* Send Icon */}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Comments;
