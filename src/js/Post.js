import React, { useEffect, useState } from "react";
import firebase from "firebase";
import { Avatar } from "@material-ui/core";
import "../css/Post.css";
import { db } from "./firebase";
import preload from "../assets/preload.jpg";

const avatarStyle = {
  height: "32px",
  width: "32px",
};

const Post = ({ user, image, username, caption, postId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [showImg, setShowImg] = useState(true);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  useEffect(() => {
    if (postId) {
      (async () => {
        db.collection("posts")
          .doc(postId)
          .collection("comments")
          .orderBy("createdAt", "desc")
          .onSnapshot((snap) => {
            setComments(
              snap.docs.map((doc) => {
                return { id: doc.id, comment: doc.data() };
              })
            );
          });
      })().then(() => setShowImg(false));
    }
  }, [postId]);

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          style={avatarStyle}
          className="post__avatar"
          alt="username"
          children={username}
        />
        <h4 className="post__username">{username}</h4>
      </div>

      <img className="post__image" src={showImg ? preload : image} alt="post" />

      <h4 className="post__text">
        <strong> {caption && username} </strong> {caption}
      </h4>
      <div className="post__comments">
        {comments.map(({ id, comment }) => {
          return (
            <p key={id}>
              <strong>{comment.username} </strong>
              {comment.text}
            </p>
          );
        })}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            type="text"
            placeholder="Add a comment..."
            className="post__input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="post__button"
            onClick={postComment}
            disabled={!comment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};
export default Post;
