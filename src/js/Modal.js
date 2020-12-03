import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { auth } from "./firebase";
import { Button, Input } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "../css/Modal.css";

//tbh i coped this this from offocial docs of material ui
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
//tbh i coped this this from offocial docs of material ui
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: "80%",
  },
}));

const SignUp = ({ isOpen, setisOpen, user, setUser, type }) => {
  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");
  const [email, setEmail] = useState("");
  const [noUsername, setNoUsername] = useState(false);

  const classes = useStyles();

  const signup = (e) => {
    e.preventDefault();
    if (!username) return setNoUsername(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        setisOpen(false);
        return response.user.updateProfile({ displayName: username });
      })
      .catch((error) => {
        alert(error.message);
      });
    setNoUsername(false);
  };

  const login = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => setisOpen(false))
      .catch((error) => alert(error.message));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username, setUser]);

  return (
    <>
      <Modal open={isOpen} onClose={() => setisOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form
            onSubmit={type === "login" ? login : signup}
            className="modal__signup"
          >
            <center>
              <img
                className="modal__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instgram logo"
              />
            </center>
            {!type && (
              <>
                <Input
                  placeholder="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {noUsername && (
                  <p className="modal__signupNoName">A username is required</p>
                )}
              </>
            )}
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <Button type="submit">{type ? "Login" : "Sign Up"}</Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default SignUp;
