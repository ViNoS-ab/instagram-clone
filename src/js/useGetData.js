import { useEffect, useState } from "react";
import { db } from "./firebase";

const useGetData = (limit, postId) => {
  const [postsLimit, setPostsLimit] = useState(limit);
  const [documents, setDocuments] = useState([]);
  const [prevDocuments, setPrevDocuments] = useState([]);
  const [createdAt, setCreatedAt] = useState(["random date"]);

  const increasePostLimit = () => {
    if (
      //detetcs if the user scroled to bottom
      document.documentElement.scrollHeight -
        document.documentElement.scrollTop ===
      document.documentElement.clientHeight
    ) {
      if (documents.some((el, i) => el.id !== prevDocuments[i]?.id))
        setPostsLimit(postsLimit + limit);
      else return "you loaded all the posts !!";
    }
  };
  useEffect(() => {
    document.addEventListener("scroll", increasePostLimit);
    return () => {
      document.removeEventListener("scroll", increasePostLimit);
    };
  });

  useEffect(() => {
    if (postId) {
      const unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("createdAt", "not-in", createdAt)
        .limit(postsLimit)
        .onSnapshot((snap) => {
          setPrevDocuments(documents);
          setDocuments(snap.docs);
        });
      return () => {
        unsubscribe();
      };
    } else {
      const unsubscribe = db
        .collection("posts")
        .orderBy("createdAt", "desc")
        .limit(postsLimit)
        .onSnapshot((snap) => {
          setPrevDocuments(documents);
          setDocuments(snap.docs);
          setCreatedAt(snap.docs.forEach((doc) => doc.createdAt));
        });
      return () => {
        unsubscribe();
      };
    }
    // eslint-disable-next-line
  }, [postsLimit, postId]);
  return { documents, increasePostLimit };
};

export default useGetData;
