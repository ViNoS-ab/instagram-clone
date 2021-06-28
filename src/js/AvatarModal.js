import { Button, Modal } from "@material-ui/core";
import React, { useState } from "react";
import "../css/AvatarModal.css";
import { storage } from "./firebase";

export default function AvatarModal({ user, image, isOpen, setIsOpen }) {
  const [progress, setProgress] = useState(0);
  const changeProfilePic = () => {
    if (!image) return;
    const uploadTask = storage
      .ref(`avatars/${image.name + image.lastModifiedDate + image.size}`)
      .put(image);
    uploadTask.on(
      "state_changed",
      (snpashot) => {
        const progress = Math.round(
          (snpashot.bytesTransferred / snpashot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (err) => {
        console.log(err);
        alert(err.message);
      },
      () => {
        storage
          .ref("avatars")
          .child(image.name + image.lastModifiedDate + image.size)
          .getDownloadURL()
          .then((url) => {
            user.updateProfile({ photoURL: url });
          })
          .then(() => {
            setIsOpen(false);
            setProgress(0);
          });
      }
    );
  };

  if (image)
    return (
      <>
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
          <div className="modals avatarModal">
            <div className="avatarModal__ImgWrap">
              <img
                className="avatarModal__img"
                src={URL.createObjectURL(image)}
                alt="Avatar preview"
              />
            </div>
            <progress
              className="imageUpload__progress"
              value={progress}
              max="100"
            />
            <Button
              style={{ background: "#0095f6", color: "#fff" }}
              onClick={changeProfilePic}
            >
              Change Photo
            </Button>
          </div>
        </Modal>
      </>
    );
  else return <></>;
}
