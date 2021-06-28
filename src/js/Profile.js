import {
  Avatar,
  Badge,
  Button,
  Input,
  InputLabel,
  Modal,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { auth, firebase } from "./firebase";
import "../css/Profile.css";
import addProfiePic from "../assets/addProfilePic.png";
import Confirm from "./Confirm";
import AvatarModal from "./AvatarModal";

const avatarSizeSmall = { width: "90px", height: "90px" };
const avatarSize = { width: "10rem", height: "10rem" };

const Profile = ({ user, posts }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isChangePhotoOpen, setIsChangePhotoOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isUploadAvatarOpen, setIsUploadAvatarOpen] = useState(false);
  const [image, setImage] = useState(null);
  const fileRef = useRef(null);
  const [avatarStyle, setAvatarStyle] = useState(
    window.innerWidth > 700 ? avatarSize : avatarSizeSmall
  );

  const resizeAvatar = () => {
    if (window.innerWidth > 700) return setAvatarStyle(avatarSize);
    setAvatarStyle(avatarSizeSmall);
  };

  const removeProfilePic = () => {
    user.updateProfile({ photoURL: null });
    console.log("breakpoint");
  };

  useEffect(() => {
    window.addEventListener("resize", resizeAvatar);

    return () => {
      window.removeEventListener("resize", resizeAvatar);
    };
  });

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
              <Badge
                className="profile__avatarBadge"
                overlap="circle"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                badgeContent={
                  <img
                    onClick={() => setIsChangePhotoOpen(true)}
                    className="profile__avatarImgBadge"
                    src={addProfiePic}
                    alt="add profile pic"
                  />
                }
              >
                <Avatar
                  style={avatarStyle}
                  className="profile__avatar"
                  src={user.photoURL}
                  area-label="avatar"
                />
              </Badge>
            </div>
            <div className="profile__infoText">
              <div className="profile__infoTextLine1">
                <h3 className="profile__infoName">{user.displayName}</h3>
                <Button
                  onClick={() => setIsUpdateOpen(!isUpdateOpen)}
                  className="profile__infoUpdateProfile"
                >
                  Edit profile
                </Button>
              </div>
              <div className="profile__infoTextLine2">
                <h4 className="profile__infoPostNum">{postCount} posts</h4>
              </div>
              {isUpdateOpen && <EditProfile user={user} />}
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

      <Modal
        open={isChangePhotoOpen}
        onClose={() => setIsChangePhotoOpen(false)}
      >
        <div className="modals profile__changePhotoModal">
          <h3>Change Profile Picture</h3>
          <input
            type="file"
            ref={fileRef}
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files[0]) {
                setImage(e.target.files[0]);
                setIsUploadAvatarOpen(true);
              }
            }}
          />
          <Button
            style={{ color: "#0095f6", fontWeight: 700 }}
            onClick={() => fileRef.current.click()}
          >
            Upload Photo
          </Button>
          <Button
            style={{ color: "#ed4956", fontWeight: 700 }}
            onClick={() => setIsRemoveOpen(true)}
          >
            Remove Current Photo
          </Button>
          <Button
            className="profile__CancelBtn"
            onClick={() => setIsChangePhotoOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <Confirm
        open={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        title="Alert !"
        text="Are you sure that you want to remove profile picture ?"
        onConfirm={removeProfilePic}
      />
      <AvatarModal
        isOpen={isUploadAvatarOpen}
        setIsOpen={setIsUploadAvatarOpen}
        image={image}
        user={user}
      />
    </>
  );
};

const EditProfile = ({ user }) => {
  const [userName, setUserName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const reAuth = async () => {
    // const signInMethod = await auth.fetchSignInMethodsForEmail(user.email);
    console.log(auth);
    const cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(
      // providerId: user.providerId,
      // signInMethod: signInMethod,
      cred
    );
  };
  const updateProfile = () => {
    if (userName !== user.displayName)
      user
        .updateProfile({ displayName: userName })
        .then(() => window.location.reload())
        .catch((err) => alert(err.message));
    if (email !== user.email)
      reAuth()
        .then(() => {
          user.updateEmail(email);
        })
        // .then(() => window.location.reload())
        .catch((err) => alert(err.message));
    if (
      currentPassword === user.providerData[0].providerId &&
      newPassword === confirmPassword
    )
      reAuth()
        .then(() => {
          user.updatePassword(newPassword);
        })
        .then(() => window.location.reload())
        .catch((err) => alert(err.message));
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateProfile();
        }}
        autoComplete="false"
        className="updateProfile"
      >
        <input
          name="New password"
          //eslint disable next line
          value={""}
          onChange={() => {}}
          id="disabled-input"
          type="password"
        />
        {[
          {
            name: "Username",
            type: "text",
            value: userName,
            setValue: setUserName,
          },
          { name: "Email*", type: "email", value: email, setValue: setEmail },
          {
            name: "Current password",
            type: "password",
            value: currentPassword,
            setValue: setCurrentPassword,
          },
          {
            name: "New password*",
            type: "password",
            value: newPassword,
            setValue: setNewPassword,
          },
          {
            name: "Confirm Password",
            type: "password",
            value: confirmPassword,
            setValue: setConfirmPassword,
          },
        ].map((inp) => {
          return <Inputs key={inp.name} {...inp} />;
        })}
        <p>
          <strong>*</strong>this field require the current password to update
        </p>
        <Button
          className="updateProfile__submitBtn"
          disabled={
            (userName === user.displayName &&
              (email === user.email || !currentPassword) &&
              !newPassword) ||
            newPassword !== confirmPassword
          }
          type="submit"
        >
          Submit
        </Button>
      </form>
    </>
  );
};

const Inputs = ({ name, value, setValue, type }) => {
  return (
    <>
      <InputLabel htmlFor={name}> {name}</InputLabel>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
      />
    </>
  );
};

export default Profile;
