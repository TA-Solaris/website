import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { prefetchPost, preloadImage } from "@/lib/posts";

let postRoutePromise = null;

function warmPost(post) {
  prefetchPost(post.slug);
  preloadImage(post.cover, "high");
  postRoutePromise ??= import("@/pages/Post");
}

export function PostCard({ post, index }) {
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

export function PostCardSkeleton() {
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
