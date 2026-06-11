import { createContext } from "react";

export const PostsContext = createContext({
  posts: [],
  isLoading: true,
  error: null,
});
