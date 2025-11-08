import { createContext, useState, useEffect } from "react";

export const PostsContext = createContext([]);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/posts.json")
      .then((res) => res.json())
      .then((data) =>
        setPosts(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
      )
      .catch((err) => console.error("Failed to load posts:", err));
  }, []);

  return (
    <PostsContext.Provider value={posts}>
      {children}
    </PostsContext.Provider>
  );
}

