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
  const [reRender, setReRender] = useState(false);
  const [
    {
      thatPostData: { uid, image, username, caption, avatar, likedUsers },
    },
    setSidePost,
  ] = useState({ thatPostData: {} });

  const { documents } = useGetData(4);

  //load a specific post using its id

  useEffect(() => {
    (async () => {
      const thatPost = await db.collection("posts").doc(postId).get();
      setSidePost({ id: thatPost.id, thatPostData: thatPost.data() });
    })();
  }, [reRender]);
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
                {image && (
                  <Post
                    user={user}
                    postId={postId}
                    image={image}
                    username={username}
                    caption={caption}
                    avatar={avatar}
                    likedUsers={likedUsers}
                    uid={uid}
                    setReRender={setReRender}
                    reRender={reRender}
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
