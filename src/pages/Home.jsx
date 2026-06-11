import { useContext, useState } from "react";
import { PostsContext } from "@/components/posts-context";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { prefetchPost, preloadImage } from "@/lib/posts";

let postRoutePromise = null;

function preloadPostRoute() {
  postRoutePromise ??= import("@/pages/Post");
  return postRoutePromise;
}

function warmPost(post) {
  prefetchPost(post.slug);
  preloadImage(post.cover, "high");
  preloadPostRoute();
}

function PostCard({ post, index }) {
  const [isCoverLoaded, setIsCoverLoaded] = useState(!post.cover);
  const isPriorityImage = index === 0;
  const isEagerImage = index < 2;

  return (
    <Link
      to={`/post/${post.slug}`}
      onFocus={() => warmPost(post)}
      onMouseEnter={() => warmPost(post)}
      onTouchStart={() => warmPost(post)}
    >
      <Card className="transition-all hover:shadow-lg hover:scale-[1.01] pt-0 overflow-hidden">
        {post.cover && (
          <div className="relative h-48 w-full overflow-hidden bg-accent">
            {!isCoverLoaded && (
              <Skeleton className="absolute inset-0 rounded-none" />
            )}
            <img
              src={post.cover}
              alt={post.title}
              width="1200"
              height="400"
              loading={isEagerImage ? "eager" : "lazy"}
              fetchPriority={isPriorityImage ? "high" : "auto"}
              decoding="async"
              onLoad={() => setIsCoverLoaded(true)}
              onError={() => setIsCoverLoaded(true)}
              className={`h-full w-full object-cover object-center transition-opacity duration-300 ${
                isCoverLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2 pb-1">{post.title}</CardTitle>
          <CardDescription>{post.date}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3">{post.summary}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function PostCardSkeleton() {
  return (
    <Card className="pt-0 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { posts, isLoading, error } = useContext(PostsContext);

  return (
    <div className="space-y-10">
      {/* Intro section */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Hi, I’m Edward.</h1>
        <p className="text-lg max-w-2xl mx-auto">
          I’m a software developer based in the UK, working in web development.
          This blog is where I share ideas, thoughts, and notes from my projects.
        </p>
      </section>

      <Separator />

      {/* Posts list */}
      <section className="grid gap-6 sm:grid-cols-2">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}

        {!isLoading &&
          posts.map((post, index) => (
            <PostCard post={post} index={index} key={post.slug} />
          ))}
      </section>

      {error && (
        <p className="text-sm text-muted-foreground">
          Posts could not be loaded. Please refresh the page.
        </p>
      )}
    </div>
  );
}
