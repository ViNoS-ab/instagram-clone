import React, { useEffect, useState, useRef } from "react";
import firebase from "firebase";
import { Avatar, Modal, Button } from "@material-ui/core";
import "../css/Post.css";
import { db } from "./firebase";
import Confirm from "./Confirm";
import like from "../assets/heart.png";
import likeD from "../assets/heartLiked.png";
import commentBtn from "../assets/comment.png";
import more from "../assets/more.svg";
// import preload from "../assets/preload.jpg";
import useGetData from "./useGetData";

const avatarStyle = {
  height: "32px",
  width: "32px",
};

const Post = ({
  user,
  avatar,
  image,
  username,
  caption,
  postId,
  likedUsers,
  uid,
}) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const { documents: post } = useGetData(10, postId);
  const postInput = useRef(null);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts")
      .doc(postId)
      .collection("comments")
      .add({
        text: comment,
        username: user.displayName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        avatar: user.photoURL || null,
      });
    setComment("");
  };

  const deletePost = () => {
    if (user?.uid !== uid) return;
    db.collection("posts").doc(postId).delete();
  };

  const clickLike = () => {
    if (likedUsers?.includes(user.uid)) {
      db.collection("posts")
        .doc(postId)
        .update(
          {
            likedUsers: firebase.firestore.FieldValue.arrayRemove(user.uid),
          },
          { merge: true }
        );
    } else if (!likedUsers?.includes(user.uid)) {
      db.collection("posts")
        .doc(postId)
        .update(
          {
            likedUsers: firebase.firestore.FieldValue.arrayUnion(user.uid),
          },
          { merge: true }
        );
    }
  };

  const clickComment = () => {
    postInput.current.focus();
  };
  useEffect(() => {
    if (postId) {
      setComments(
        post.map((doc) => {
          return { id: doc.id, comment: doc.data() };
        })
      );
    }
  }, [postId, post]);

  return (
    <div className="post">
      <div className="post__header">
        <div>
          <Avatar
            style={avatarStyle}
            className="post__avatar"
            alt="username"
            src={avatar}
            children={username}
          />
          <h4 className="post__username">{username}</h4>
        </div>
        {user?.uid === uid && (
          <button
            className="post__options"
            aria-label="more options"
            onClick={() => setIsOptionOpen(true)}
          >
            <img src={more} alt="more" />
          </button>
        )}
      </div>

      <img className="post__image" src={image} alt="post" />
      <div style={{ padding: "0 15px" }}>
        <div className="post__actions">
          <span className="post__action" onClick={user && clickLike}>
            <img
              src={likedUsers?.includes(user.uid) ? likeD : like}
              alt="like"
              className="like"
            />
          </span>
          <span className="post__action" onClick={user && clickComment}>
            <img src={commentBtn} alt="comment" className="comment" />
          </span>
        </div>
        {likedUsers?.length > 0 && (
          <p className="post__likesNum">{likedUsers.length} likes</p>
        )}
      </div>
      <h4 className="post__text">
        <strong className="post__username"> {caption && username} </strong>
        {caption}
      </h4>

      <div className="post__comments">
        {comments.map(({ id, comment }) => {
          return (
            <p key={id}>
              <strong className="post__username">{comment.username} </strong>
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
            ref={postInput}
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
      {user?.uid === uid && isOptionOpen && (
        <Modal open={isOptionOpen} onClose={() => setIsOptionOpen(false)}>
          <div className="modals post__delete profile__changePhotoModal ">
            <Button
              style={{ color: "#ed4956", fontWeight: 700 }}
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
            <Button onClick={() => setIsOptionOpen(false)}>Cancel</Button>
          </div>
        </Modal>
      )}
      {user?.uid === uid && isDeleteOpen && (
        <Confirm
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          title="Alert !"
          text="Are you sure that you want to delete this post ?"
          onConfirm={deletePost}
        />
      )}
    </div>
  );
};
export default Post;
