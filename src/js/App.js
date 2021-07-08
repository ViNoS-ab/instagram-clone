import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { db } from "./firebase";
import "../css/App.css";
import Header from "./header";
import Post from "./Post";
import Profile from "./Profile";
import useGetData from "./useGetData";

const postId = "rf0MU0nJIVVkBhUWMrzV";

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [sidePost, setSidePost] = useState(null);

  const { documents } = useGetData(4);

  //load a specific post using it's id
  useEffect(() => {
    const unsubscribe = db
      .collection("posts")
      .doc(postId)
      .onSnapshot((snap) =>
        setSidePost({ id: snap.id, thatPostData: snap.data() })
      );
    return () => {
      unsubscribe();
    };
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
                {sidePost?.thatPostData && (
                  <Post
                    user={user}
                    postId={postId}
                    image={sidePost?.thatPostData?.image}
                    username={sidePost?.thatPostData?.username}
                    caption={sidePost?.thatPostData?.caption}
                    avatar={sidePost?.thatPostData?.avatar}
                    likedUsers={sidePost?.thatPostData?.likedUsers}
                    uid={sidePost?.thatPostData?.uid}
                  />
                )}
              </div>
              <div className="app__postsLeft">
                {posts.map(
                  ({
                    id,
                    post: { uid, image, username, caption, avatar, likedUsers },
                  }) => {
                    return (
                      <Post
                        user={user}
                        postId={id}
                        key={id}
                        image={image}
                        username={username}
                        caption={caption}
                        avatar={avatar}
                        likedUsers={likedUsers}
                        uid={uid}
                      />
                    );
                  }
                )}
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
