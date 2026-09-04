import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PostsContext } from "@/components/posts-context";
import { applyMarkdownNoticeBlocks } from "@/lib/markdown-notices";
import { fetchPostHtml, preloadImage } from "@/lib/posts";

const siteTitle = "Edward Potter's Blog";

function decorateArticleImages(container) {
  container.querySelectorAll("img").forEach((image) => {
    image.setAttribute("loading", "lazy");
    image.setAttribute("decoding", "async");
    image.setAttribute("fetchpriority", "auto");
    image.setAttribute(
      "sizes",
      "(min-width: 1024px) 896px, calc(100vw - 3rem)",
    );
  });
}

async function applyPostMarkup(html) {
  const template = document.createElement("template");
  template.innerHTML = html;

  applyMarkdownNoticeBlocks(template.content);
  decorateArticleImages(template.content);

  const { applySyntaxHighlighting } = await import("@/lib/syntax-highlighting");
  applySyntaxHighlighting(template.content);

  return template.innerHTML;
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  textarea.style.left = "-1000px";

  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();

  return Promise.resolve();
}

function PostSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="aspect-[3/1] w-full rounded-lg" />
      <header className="space-y-3">
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-5 w-28" />
      </header>
      <Skeleton className="h-10 w-36" />
      <Separator />
      <PostBodySkeleton />
    </div>
  );
}

function PostBodySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-11/12" />
      <Skeleton className="h-5 w-10/12" />
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-9/12" />
    </div>
  );
}

export default function Post() {
  const { slug } = useParams();
  const articleRef = useRef(null);
  const { posts, isLoading: postsLoading } = useContext(PostsContext);
  const post = useMemo(
    () => posts.find((item) => item.slug === slug),
    [posts, slug],
  );
  const [html, setHtml] = useState("");
  const [isHtmlLoading, setIsHtmlLoading] = useState(true);
  const [htmlError, setHtmlError] = useState(null);
  const [isCoverLoaded, setIsCoverLoaded] = useState(!post?.cover);

  useEffect(() => {
    setIsCoverLoaded(!post?.cover);

    if (post?.cover) {
      preloadImage(post.cover, "high");
    }
  }, [post?.cover]);

  useEffect(() => {
    let isActive = true;

    setHtml("");
    setHtmlError(null);
    setIsHtmlLoading(true);

    fetchPostHtml(slug)
      .then(applyPostMarkup)
      .then((markup) => {
        if (isActive) {
          setHtml(markup);
        }
      })
      .catch((error) => {
        if (!isActive) return;

        console.error("Failed to load post:", error);
        setHtmlError(error);
      })
      .finally(() => {
        if (isActive) {
          setIsHtmlLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!post?.title) return;
    document.title = `${post.title} - ${siteTitle}`;
    return () => {
      document.title = siteTitle;
    };
  }, [post]);

  useEffect(() => {
    if (!html || !articleRef.current) return;

    const article = articleRef.current;
    let frame = null;
    let isActive = true;
    let cleanup = () => {};

    import("@/lib/syntax-highlighting").then(
      ({ updateCodeBlockActionSpacing }) => {
        if (!isActive) return;

        const updateSpacing = () => {
          if (frame !== null) {
            window.cancelAnimationFrame(frame);
          }

          frame = window.requestAnimationFrame(() => {
            updateCodeBlockActionSpacing(article);
            frame = null;
          });
        };

        updateSpacing();
        window.addEventListener("resize", updateSpacing);

        const resizeObserver =
          "ResizeObserver" in window ? new ResizeObserver(updateSpacing) : null;
        resizeObserver?.observe(article);

        cleanup = () => {
          if (frame !== null) {
            window.cancelAnimationFrame(frame);
          }

          window.removeEventListener("resize", updateSpacing);
          resizeObserver?.disconnect();
        };
      },
    );

    return () => {
      isActive = false;
      cleanup();
    };
  }, [html]);

  if (postsLoading && !post) {
    return <PostSkeleton />;
  }

  if (!post) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <Button asChild variant="outline" className="cursor-pointer">
          <Link to="/posts">Back to Posts</Link>
        </Button>
      </div>
    );
  }

  function handleArticleClick(event) {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest(".copy-code-button");
    if (!button) return;

    const code = button.closest("pre")?.querySelector("code");
    if (!code?.textContent) return;

    copyText(code.textContent)
      .then(() => {
        button.textContent = "Copied";
        button.dataset.copied = "true";
      })
      .catch(() => {
        button.textContent = "Failed";
      })
      .finally(() => {
        window.setTimeout(() => {
          button.textContent = "Copy";
          delete button.dataset.copied;
        }, 1600);
      });
  }

  return (
    <div className="space-y-6">
      {post.cover && (
        <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg bg-accent shadow">
          {!isCoverLoaded && (
            <Skeleton className="absolute inset-0 rounded-none" />
          )}
          <img
            src={post.cover}
            alt={post.title}
            width="1200"
            height="400"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setIsCoverLoaded(true)}
            onError={() => setIsCoverLoaded(true)}
            className={`h-full w-full object-cover object-center transition-opacity duration-300 ${
              isCoverLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      )}

      <header className="space-y-3">
        <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>
        <p className="text-gray-500">{post.date}</p>
      </header>

      <div className="mb-2">
        <Button asChild variant="outline" className="cursor-pointer">
          <Link to="/posts">← Back to Posts</Link>
        </Button>
      </div>

      <Separator />

      {isHtmlLoading && <PostBodySkeleton />}

      {htmlError && (
        <p className="text-sm text-muted-foreground">
          This post could not be loaded. Please refresh the page.
        </p>
      )}

      {html && (
        <article
          ref={articleRef}
          className="prose prose-slate dark:prose-invert max-w-none space-y-4"
          onClick={handleArticleClick}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}
