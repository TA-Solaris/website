import { useContext } from "react";
import { PostsContext } from "@/components/posts-context";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PostCard, PostCardSkeleton } from "@/components/post-cards";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { posts, isLoading, error } = useContext(PostsContext);

  return (
    <div className="flex flex-1 items-center">
      <div className="w-full space-y-10">
        <section className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Hi, I’m Edward.</h1>
          <p className="text-lg max-w-2xl mx-auto">
            I’m a software developer based in the UK, working in web development.
            This blog is where I share ideas, thoughts, and notes from my projects.
          </p>
        </section>

        <Separator />

        <section className="grid gap-6 sm:grid-cols-2">
          {isLoading &&
            Array.from({ length: 2 }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}

          {!isLoading &&
            posts.slice(0, 2).map((post, index) => (
              <PostCard post={post} index={index} key={post.slug} />
            ))}
        </section>

        {!isLoading && posts.length > 2 && (
          <div className="text-center">
            <Button asChild variant="outline">
              <Link to="/posts">See all posts</Link>
            </Button>
          </div>
        )}

        {error && (
          <p className="text-sm text-muted-foreground">
            Posts could not be loaded. Please refresh the page.
          </p>
        )}
      </div>
    </div>
  );
}
