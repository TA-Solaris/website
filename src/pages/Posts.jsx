import { useContext, useEffect, useRef, useState } from "react";
import { PostsContext } from "@/components/posts-context";
import { PostCard, PostCardSkeleton } from "@/components/post-cards";
import { Button } from "@/components/ui/button";

const pageSize = 5;

export default function Posts() {
  const { posts, isLoading, error } = useContext(PostsContext);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const loadMoreRef = useRef(null);
  const hasMore = visibleCount < posts.length;

  useEffect(() => {
    const loadMore = loadMoreRef.current;
    if (!loadMore || !hasMore) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisibleCount((count) => count + pageSize);
      }
    }, { rootMargin: "200px" });

    observer.observe(loadMore);
    return () => observer.disconnect();
  }, [hasMore]);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Posts</h1>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(min(20rem,100%),1fr))] gap-6">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}

        {!isLoading &&
          posts.slice(0, visibleCount).map((post, index) => (
            <PostCard post={post} index={index} key={post.slug} />
          ))}
      </section>

      {hasMore && (
        <div className="text-center">
          <Button
            ref={loadMoreRef}
            variant="outline"
            onClick={() => setVisibleCount((count) => count + pageSize)}
          >
            Load more posts
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-muted-foreground">
          Posts could not be loaded. Please refresh the page.
        </p>
      )}
    </div>
  );
}
