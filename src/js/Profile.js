import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "../css/Profile.css";

const avatarStyle = {
  width: "150px",
  height: "150px",
};

const Profile = ({ user, posts }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    setMyPosts(posts.filter(({ post }) => post.uid === user.uid));
  }, [posts, user.uid]);

  useEffect(() => {
    setPostCount(myPosts.length);
  }, [myPosts.length]);
  return (
    <>
      <div className="profile">
        <div className="profile__wrapper">
          <div className="profile__info">
            <div className="profile__avatarContainer">
              <Avatar
                style={avatarStyle}
                className="profile__avatar"
                src={user.photoURL}
                alt="avatar"
                children={user.dsplayName}
              />
            </div>
            <div className="profile__infoText">
              <div className="profile__infoTextLine1">
                <h3 className="profile__infoName">{user.displayName}</h3>
                <Button className="profile__infoUpdateProfile">
                  Edit profile
                </Button>
              </div>
              <div className="profile__infoTextLine2">
                <h4 className="profile__infoPostNum">{postCount} posts</h4>
              </div>
            </div>
          </div>
          <div className="profile__posts">
            {myPosts.map(({ id, post: { image, username, caption } }) => {
              return (
                <div key={id} className="profile__postImgContainer">
                  <img
                    className="profile__postsImg"
                    src={image}
                    alt={caption}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
