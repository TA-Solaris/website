import { useContext, useEffect, useRef, useState } from "react";
import { PostsContext } from "@/components/posts-context";
import { PostCard, PostCardSkeleton } from "@/components/post-cards";
import { Button } from "@/components/ui/button";
import { filterPosts } from "@/lib/tags";
import { X } from "lucide-react";

const pageSize = 5;

export default function Posts() {
  const { posts, tagCounts, isLoading, error } = useContext(PostsContext);
  const [selectedTags, setSelectedTags] = useState([]);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const loadMoreRef = useRef(null);
  const filteredPosts = filterPosts(posts, selectedTags);
  const hasMore = visibleCount < filteredPosts.length;

  function toggleTag(tag) {
    setSelectedTags((selected) =>
      selected.includes(tag)
        ? selected.filter((item) => item !== tag)
        : [...selected, tag],
    );
    setVisibleCount(pageSize);
  }

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
    <div className="space-y-4">
      <h1 className="text-4xl font-bold tracking-tight">Posts</h1>

      {!isLoading && Object.keys(tagCounts).length > 0 && (
        <div className="overflow-x-auto" aria-label="Filter posts by tag">
          <div className="flex w-max gap-2">
            {Object.entries(tagCounts).map(([tag, count]) => {
              const isSelected = selectedTags.includes(tag);

              return (
                <button
                  type="button"
                  aria-pressed={isSelected}
                  className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => toggleTag(tag)}
                  key={tag}
                >
                  <span>#{tag}</span>
                  <span className="text-xs tabular-nums opacity-70">{count}</span>
                  {isSelected && <X className="size-3.5" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <section className="grid grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))] gap-6">
        {isLoading &&
          Array.from({ length: pageSize }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}

        {!isLoading &&
          filteredPosts.slice(0, visibleCount).map((post, index) => (
            <PostCard post={post} index={index} key={post.slug} />
          ))}

        {!isLoading && filteredPosts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No posts match all selected tags.
          </p>
        )}
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
