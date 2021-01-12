import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { auth } from "./firebase";
import { Link, useLocation } from "react-router-dom";
import SignUp from "./Modal";
import "../css/Header.css";
import addPost from "../assets/addPost.png";
import ImageUpload from "./ImageUpload";
import homeImg from "../assets/home.svg";
import homeHovImg from "../assets/homeHov.svg";

const Header = ({ user, setUser }) => {
  const [isOpen, setisOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isProfileOption, setIsProfileOption] = useState(false);
  const optionContain = useRef(null);

  let location = useLocation();

  const avatarStyle =
    location.pathname === "/profile"
      ? {
          height: "20px",
          width: "20px",
          border: "2px solid #424242",
          padding: "1px",
          marginLeft: "12px",
        }
      : {
          height: "23px",
          width: "23px",
        };

  useEffect(() => {
    if (location.pathname === "/profile") {
    }
  });
  return (
    <div className="header">
      <Link to="/">
        <img
          className="header__image"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instgram logo"
        />
      </Link>

      {user ? (
        <div className="header__links">
          <div className="header__home">
            <Link to="/">
              <img
                src={location.pathname === "/" ? homeHovImg : homeImg}
                alt="home"
              />
            </Link>
          </div>
          <div
            className="header__addPost"
            onClick={() => (user ? setIsUploadOpen(true) : setIsLogOpen(true))}
          >
            <img src={addPost} alt="add post" />
          </div>

          <Avatar
            className="header__avatar"
            style={avatarStyle}
            src={user.photoURL}
            children={user?.displayName?.split("")[0]}
            alt="username"
            onClick={() => {
              setIsProfileOption(true);
              optionContain?.current?.toggleAttribute("hidden");
              optionContain?.current?.focus();
            }}
          />

          <div
            hidden={true}
            ref={optionContain}
            tabIndex="0"
            style={
              isProfileOption
                ? { opacity: "1", transform: "translateY(8px)" }
                : { opacity: "0", transform: "translateY(0px)" }
            }
            className="header__profileOptionMain"
            onBlur={() => {
              setTimeout(() => {
                optionContain?.current?.setAttribute("hidden", true);
                optionContain?.current?.focus();
              }, 400);
              setIsProfileOption(false);
            }}
          >
            <div className="header__rotateDiv"></div>
            <div className="header__profileOption">
              <Button
                style={{
                  padding: 0,
                  textTransform: "none",
                  outline: "none",
                  justifyContent: "flex-start",
                }}
              >
                <Link
                  style={{
                    padding: "6px 8px",
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                    justifyContent: "flex-start",
                  }}
                  to="./profile"
                >
                  <p style={{ width: "0" }}> Profile</p>
                </Link>
              </Button>
              <Button
                className="header__logout"
                style={{
                  textTransform: "none",
                  justifyContent: "flex-start",
                  borderTop: "1px solid lightgray",
                }}
                onClick={() => auth.signOut()}
              >
                Log Out
              </Button>
            </div>
          </div>
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
