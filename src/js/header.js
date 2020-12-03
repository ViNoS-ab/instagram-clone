import { Avatar, Button } from "@material-ui/core";
import React, { useState } from "react";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import SignUp from "./Modal";
import "../css/Header.css";
import addPost from "../assets/addPost.png";
import ImageUpload from "./ImageUpload";

const avatarStyle = {
  height: "30px",
  width: "30px",
};

const Header = ({ user, setUser }) => {
  const [isOpen, setisOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="header">
      <Link to="/">
        <img
          className="header__image"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instgram logo"
        />
      </Link>
      <span
        className="header__addPost"
        onClick={() => (user ? setIsUploadOpen(true) : setIsLogOpen(true))}
      >
        <img src={addPost} alt="add post" />
      </span>

      {user ? (
        <div className="header__links">
          <Link to="./profile">
            <Avatar
              className="header__avatar"
              style={avatarStyle}
              src={user.photoURL}
              alt="username"
              children={user.username}
            />
          </Link>
          <Button onClick={() => auth.signOut()}>Logout</Button>
        </div>
      ) : (
        <div className="header__loginContainer">
          <Button onClick={() => setisOpen(true)}>Sign up</Button>
          <Button onClick={() => setIsLogOpen(true)}>Login</Button>
        </div>
      )}

      <SignUp
        isOpen={isOpen}
        setisOpen={setisOpen}
        user={user}
        setUser={setUser}
      />
      <SignUp
        isOpen={isLogOpen}
        setisOpen={setIsLogOpen}
        user={user}
        setUser={setUser}
        type="login"
      />
      {user?.displayName && (
        <ImageUpload
          username={user.displayName}
          isOpen={isUploadOpen}
          setisOpen={setIsUploadOpen}
          user={user}
        />
      )}
    </div>
  );
};
export default Header;
