import { useEffect, useState } from "react";
import { PostsContext } from "@/components/posts-context";
import { fetchPosts, warmPostAssets } from "@/lib/posts";

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let cancelWarmup = () => {};

    fetchPosts()
      .then((data) => {
        if (!isMounted) return;

        setPosts(data);
        setError(null);
        cancelWarmup = warmPostAssets(data);
      })
      .catch((err) => {
        if (!isMounted) return;

        console.error("Failed to load posts:", err);
        setError(err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      cancelWarmup();
    };
  }, []);

  return (
    <PostsContext.Provider value={{ posts, isLoading, error }}>
      {children}
    </PostsContext.Provider>
  );
}
