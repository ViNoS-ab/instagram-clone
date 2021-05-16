import firebase from "firebase";
import { Button, Modal } from "@material-ui/core";
import React, { useState } from "react";
import { storage, db } from "./firebase";
import "../css/ImageUpload.css";

const ImageUpload = ({ user, username, isOpen, setisOpen }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [imageSrc, setImageSrc] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = () => {
    if (!image) return;
    const uploadTask = storage
      .ref(`images/${image.name + image.lastModifiedDate + image.size}`)
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
          .ref("images")
          .child(image.name + image.lastModifiedDate + image.size)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              username,
              image: url,
              caption,
              uid: user.uid,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              avatar: user.photoURL || null,
            });
          });
        setImage(null);
        setProgress(0);
        setCaption("");
        setImageSrc(null);
      }
    );
  };

  return (
    <Modal open={isOpen} onClose={() => setisOpen(false)}>
      <div className="imageUpload modals">
        {image && imageSrc && (
          <img className="imageUpload__preview" src={imageSrc} alt="preview" />
        )}
        <progress
          className="imageUpload__progress"
          value={progress}
          max="100"
        />
        <textarea
          className="imageUpload__caption"
          type="text"
          placeholder="enter a caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input
          className="imageUpload__file"
          type="file"
          onChange={handleChange}
        />
        <Button className="imageUpload__button" onClick={handleUpload}>
          Upload
        </Button>
      </div>
    </Modal>
  );
};

export default ImageUpload;
