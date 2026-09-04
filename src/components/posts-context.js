import { createContext } from "react";

export const PostsContext = createContext({
  posts: [],
  tagCounts: {},
  isLoading: true,
  error: null,
});
