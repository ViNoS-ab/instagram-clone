import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { db } from "./firebase";
import "../css/App.css";
import Header from "./header";
import Post from "./Post";
import Profile from "./Profile";
import useGetData from "./useGetData";
import { Button } from "@material-ui/core";

const postId = "rf0MU0nJIVVkBhUWMrzV";

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [sidePost, setSidePost] = useState(null);

  const { documents, increasePostLimit } = useGetData(4);

  //load a specific post using it's id
  useEffect(() => {
    (async () => {
      const thatPost = await db.collection("posts").doc(postId).get();
      setSidePost({ id: thatPost.id, comment: thatPost.data() });
    })();
  }, []);

  // gets all posts
  useEffect(() => {
    setPosts(
      documents.map((doc) => {
        return {
          id: doc.id,
          post: doc.data(),
        };
      })
    );
  }, [documents]);

  return (
    <>
      <Router>
        <div className="app">
          <Header user={user} setUser={setUser} />

          <Route exact path="/">
            <div className="app__posts">
              <div className="app__postsRight">
                <Post
                  user={user}
                  postId={postId}
                  username={sidePost?.comment?.username}
                  caption={sidePost?.comment?.caption}
                  image={sidePost?.comment?.image}
                  id={sidePost?.id}
                />
              </div>
              <div className="app__postsLeft">
                {posts.map(({ id, post: { image, username, caption } }) => {
                  return (
                    <Post
                      user={user}
                      postId={id}
                      key={id}
                      image={image}
                      username={username}
                      caption={caption}
                    />
                  );
                })}
                <Button onClick={increasePostLimit}>load previous posts</Button>
              </div>
            </div>
          </Route>
          {user && (
            <Route path="/profile">
              <Profile user={user} posts={posts} />
            </Route>
          )}
        </div>
      </Router>
    </>
  );
}

export default App;
